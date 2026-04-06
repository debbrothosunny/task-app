<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{

    use HasFactory; 
    protected $fillable = [
        'user_id',
        'content',
        'image',
        'visibility',
        'likes_count',    
        'comments_count', 
    ];

    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? asset('storage/' . $value) : null,
        );
    }

    // Relationship: A post belongs to a User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function likes() {
    return $this->morphMany(Like::class, 'likeable');
    }

    public function comments() {
        return $this->hasMany(Comment::class)->whereNull('parent_id'); // শুধু মেইন কমেন্টগুলো আসবে
    }
}
