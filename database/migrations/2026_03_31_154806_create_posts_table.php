<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
        /**
         * Run the migrations.
        */
        public function up(): void
        {
            Schema::create('posts', function (Blueprint $table) {
            $table->id();
            // The author of the post
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->text('content')->nullable();
            $table->string('image')->nullable(); // For the post image

            $table->unsignedBigInteger('likes_count')->default(0);
            $table->unsignedBigInteger('comments_count')->default(0);
            
            // Support private and public posts
            $table->enum('visibility', ['public', 'private'])->default('public');
            
            $table->timestamps();
            $table->index(['visibility', 'created_at','user_id']);
            });
        }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
