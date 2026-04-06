<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\CommentStoreRequest;
use App\Models\Post;
use App\Models\Like;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class CommentController extends Controller
{
    public function store(CommentStoreRequest $request, Post $post)
    {
        $validated = $request->validated();
        $currentUserId = Auth::id();

        // Check if user can comment on private post
        if ($post->visibility === 'private' && $post->user_id !== $currentUserId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate parent comment exists if provided
        if (!empty($validated['parent_id'])) {
            $parentExists = Comment::where('id', $validated['parent_id'])
                                ->where('post_id', $post->id)
                                ->exists();
            if (!$parentExists) {
                return response()->json(['message' => 'Invalid parent'], 400);
            }
        }

        // Create comment within transaction
        $comment = DB::transaction(function () use ($validated, $post, $currentUserId) {
            $newComment = $post->comments()->create([
                'user_id'   => $currentUserId,
                'parent_id' => $validated['parent_id'] ?? null,
                'content'   => $validated['content'],
            ]);
            return $newComment;
        });

        // Load comment with relationships and counts
        $finalComment = Comment::with(['user:id,first_name,last_name'])
            ->withCount(['likes as likes_count', 'replies as replies_count'])
            ->withExists(['likes as is_liked' => function($q) use ($currentUserId) {
                $q->where('user_id', $currentUserId);
            }])
            ->find($comment->id);

        // Cast is_liked to boolean
        $finalComment->is_liked = (bool) $finalComment->is_liked;

        // Refresh post to get updated counts
        $post->refresh();

        return response()->json([
            'comment'               => $finalComment,
            'latest_comments_count' => $post->comments_count
        ], 201);
    }

    public function getReplies($id)
    {
        $currentUserId = auth('sanctum')->id();

        // Fetch parent comment with associated post (Eager Loading)
        $parentComment = Comment::with('post:id,user_id,visibility')->findOrFail($id);

        // SECURITY CHECK: Private Post Authorization
        // If the main post is private and user is not the owner, they cannot view replies
        if ($parentComment->post->visibility === 'private' && 
            $parentComment->post->user_id !== $currentUserId) {
            return response()->json(['message' => 'Unauthorized access to private discussion.'], 403);
        }

        // Fetch all replies
        $replies = Comment::where('parent_id', $id)
            ->with(['user:id,first_name,last_name'])
            ->withCount([
                'likes as likes_count',
                'replies as replies_count',
            ])
            ->withExists(['likes as is_liked' => function($query) use ($currentUserId) {
                $query->where('user_id', $currentUserId);
            }])
            ->oldest()
            ->get();

        // Transform: Cast is_liked to boolean
        $replies->transform(function ($reply) {
            $reply->is_liked = (bool) $reply->is_liked;
            return $reply;
        });

        return response()->json($replies);
    }
}
