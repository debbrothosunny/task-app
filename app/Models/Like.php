<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Like extends Model
{
    use HasFactory;

    // Allow these fields for mass assignment
    protected $fillable = [
        'user_id',
        'likeable_id',
        'likeable_type'
    ];

    protected static function booted()
    {
        // When a new like is created
        static::created(function ($like) {
            if ($like->likeable_type === \App\Models\Post::class) {
                // Increment by +1 directly in the database
                $like->likeable()->increment('likes_count');
            }
        });

        // When a like is deleted (Unliked)
        static::deleted(function ($like) {
            if ($like->likeable_type === \App\Models\Post::class) {
                // Decrement by -1 directly in the database
                $like->likeable()->decrement('likes_count');
            }
        });
    }

    /**
     * Polymorphic relation mapping.
     * This will return the object (Post or Comment) that was liked.
     */
    public function likeable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Relationship with the user who gave the like.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}