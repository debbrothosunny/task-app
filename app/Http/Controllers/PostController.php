<?php

namespace App\Http\Controllers;
use App\Http\Requests\StorePostRequest;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Str;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    // 1. Fetch feed data (Scalable with Pagination)
    public function index()
    {
        $currentUserId = Auth::id();

        return Post::query()
            // 1. Security filter: Public posts and own private posts
            ->where(function ($query) use ($currentUserId) {
                $query->where('visibility', 'public')
                    ->orWhere(function ($q) use ($currentUserId) {
                        $q->where('visibility', 'private')
                            ->where('user_id', $currentUserId);
                    });
            })
            ->select(['id', 'user_id', 'content', 'image', 'visibility', 'comments_count', 'likes_count', 'created_at'])
            ->with([
                'user:id,first_name,last_name',
                'likes' => function ($query) {
                    $query->latest()
                        ->take(5) 
                        ->with('user:id,first_name,last_name');
                },
                'comments' => function ($query) use ($currentUserId) {
                    $query->whereNull('parent_id')
                        ->select(['id', 'post_id', 'user_id', 'content', 'created_at'])
                        ->with(['user:id,first_name,last_name'])
                        ->withCount([
                            'likes as likes_count',
                            'likes as is_liked' => fn($q) => $q->where('user_id', $currentUserId),
                            'replies as replies_count'
                        ])
                        ->latest('id')
                        ->take(5);
                }
            ])
            ->withCount(['likes as is_liked' => fn($q) => $q->where('user_id', $currentUserId)])
            ->latest('id')
            ->cursorPaginate(10)
            ->through(function ($post) {
                $post->is_liked = (bool) $post->is_liked;
                $post->comments->each(function ($comment) {
                    $comment->is_liked = (bool) $comment->is_liked;
                });
                return $post;
            });
    }

    // 2. Create new post (Text + Image)
    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();
        $imagePath = null;

        if ($request->hasFile('image')) {
            try {
                $image = $request->file('image');
                $filename = 'post_' . Str::random(10) . '_' . time() . '.webp';
                
                // Intervention Image 3 code
                $processedImage = Image::read($image)
                    ->scale(width: 1200) 
                    ->toWebp(quality: 80);

                $path = 'posts/' . $filename;
                Storage::disk('public')->put($path, (string) $processedImage);
                
                $imagePath = $path; 
            } catch (\Exception $e) {
                return response()->json(['error' => 'Image processing failed: ' . $e->getMessage()], 500);
            }
        }

        // Saving data to $post variable
        $post = Post::create([
            'user_id'    => Auth::id(),
            'content'    => $validated['content'] ?? null,
            'image'      => $imagePath,
            'visibility' => $validated['visibility'] ?? 'public',
        ]);

        $post->load(['user:id,first_name,last_name'])->loadCount(['likes', 'comments']);

        $post->is_liked = false; 

        return response()->json($post, 201);
    }

    // 3. Like/Unlike logic (Toggle)
    public function toggleLike(Request $request, $id, $type)
    {
        // 1. Authentication check
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = Auth::user(); 

        // 2. Model resolution (Post or Comment)
        if ($type === 'post') {
            $model = Post::find($id);
            
            // SECURITY CHECK: Private Post Authorization
            if ($model && $model->visibility === 'private' && $model->user_id !== $user->id) {
                return response()->json(['message' => 'This post is private. You cannot perform this action.'], 403);
            }

        } elseif ($type === 'comment' || $type === 'reply') {
            $model = Comment::find($id);
            
            // SECURITY CHECK: Private Comment Access (If associated post is private)
            if ($model && $model->post->visibility === 'private' && $model->post->user_id !== $user->id) {
                return response()->json(['message' => 'Access forbidden to this content.'], 403);
            }
        } else {
            return response()->json(['message' => 'Invalid type'], 400);
        }

        // 3. Model existence check
        if (!$model) {
            return response()->json(['message' => 'Content not found'], 404);
        }

        // 4. Toggle logic (Atomic Operation)
        $existingLike = $model->likes()->where('user_id', $user->id)->first();

        if ($existingLike) {
            $existingLike->delete();
            $liked = false;
        } else {
            $model->likes()->create(['user_id' => $user->id]);
            $liked = true;
        }

        // 5. Response data (Optimized with Eager Loading)
        $likesCount = $model->likes()->count();

        return response()->json([
            'liked' => $liked,
            'likes_count' => $likesCount,
            'recent_likers' => $model->likes()
                ->with('user:id,first_name,last_name')
                ->latest()
                ->take(3)
                ->get()
                ->map(fn($l) => $l->user ? "{$l->user->first_name} {$l->user->last_name}" : 'Anonymous')
        ]);
    }

    public function likedUsers($id, $type)
    {
        $currentUserId = Auth::id();

        // 1. Find model and check visibility
        if ($type === 'post') {
            $model = Post::findOrFail($id);
            
            // SECURITY: Only post owner can see likes list of private posts
            if ($model->visibility === 'private' && $model->user_id !== $currentUserId) {
                return response()->json(['message' => 'Unauthorized access to private content details.'], 403);
            }
        } else {
            $model = Comment::findOrFail($id);
            
            // SECURITY: Check if the post associated with this comment is private
            if ($model->post->visibility === 'private' && $model->post->user_id !== $currentUserId) {
                return response()->json(['message' => 'Unauthorized access.'], 403);
            }
        }

        // 2. Optimized data fetching (Eager Loading)
        // Fetching directly with user relationship for easier plucking
        $users = $model->likes()
            ->with('user:id,first_name,last_name') // Add profile picture here if needed
            ->get()
            ->pluck('user')
            ->filter(); // Remove null values if user was deleted

        return response()->json($users);
    }
}
