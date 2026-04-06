<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 12, // অথবা \App\Models\User::factory()
            'content' => $this->faker->paragraph(),
            'image' => 'https://picsum.photos/seed/' . $this->faker->uuid . '/800/600', // ইউনিক ইমেজ URL
            'visibility' => 'public',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
