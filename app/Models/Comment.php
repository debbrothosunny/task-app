<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;


class Comment extends Model
{
    // 1. Define the fillable fields
    protected $fillable = [
        'user_id', 
        'post_id', 
        'parent_id', 
        'content'
    ];

    protected static function booted()
    {
        static::created(function ($comment) {
            $comment->post->increment('comments_count');
        });

        static::deleted(function ($comment) {
            $comment->post->decrement('comments_count');
        });
    }


    /**
     * 2. The user who made the comment
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 3. The post under which the comment was made
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * 4. Fetch replies (Self-referencing)
     * This will fetch all comments whose parent_id equals this comment's ID
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id')->latest();
    }

    /**
     * 5. Main comment (if this is a reply)
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     * 6. How many likes this comment has (Polymorphic)
     */
    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }
}