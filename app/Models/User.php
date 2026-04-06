<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // ১. এটি অবশ্যই ইমপোর্ট করতে হবে

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Add this relationship
    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    // Optional: Get all posts this user has liked
    public function likedPosts()
    {
        return $this->morphedByMany(Post::class, 'likeable', 'likes');
    }

    // Optional: Get all comments this user has liked
    public function likedComments()
    {
        return $this->morphedByMany(Comment::class, 'likeable', 'likes');
    }
}