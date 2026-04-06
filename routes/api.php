<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Public Routes ---
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

// --- Authenticated Routes ---
Route::middleware(['auth:sanctum', 'throttle:social_actions'])->group(function () {
    
    // --- Feed & Posts ---
    Route::get('/feed', [PostController::class, 'index']); 
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store'); // Named for RateLimiter
    Route::get('/posts/{post}', [PostController::class, 'show']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
    
    // --- Interaction (Likes) ---
    Route::post('/like/{id}/{type}', [PostController::class, 'toggleLike'])
        ->whereIn('type', ['post', 'comment', 'reply']); 

    // --- Comments & Replies ---
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::get('/comments/{comment}/replies', [CommentController::class, 'getReplies']); // Moved inside auth for security
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    
    // --- Liked Users ---
    Route::get('/likes/{id}/{type}/users', [PostController::class, 'likedUsers'])
        ->whereIn('type', ['post', 'comment', 'reply']);

    Route::post('/logout', [AuthController::class, 'logout']);
});