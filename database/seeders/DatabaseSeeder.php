<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post; 
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // ১. টেস্ট ইউজার তৈরি বা খুঁজে নেওয়া
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'first_name' => 'Deb Brotho',
                'last_name' => 'Nath Sunny',
                'password' => bcrypt('password'),
            ]
        );

        $this->command->info('User ready! Starting to seed 50 posts with real downloaded images...');

        // ২. স্টোরেজ ডিরেক্টরি নিশ্চিত করা (public/storage/posts)
        if (!Storage::disk('public')->exists('posts')) {
            Storage::disk('public')->makeDirectory('posts');
        }

        // ৩. ৫০টি পোস্ট তৈরি করা
        $totalPosts = 50;

        for ($i = 1; $i <= $totalPosts; $i++) {
            // ডামি ইমেজ ডাউনলোড লজিক
            $imageName = 'post_' . Str::random(10) . '_' . time() . '.jpg';
            $imageUrl = "https://picsum.photos/800/600?random=" . $i;

            try {
                // ইমেজ কন্টেন্ট নিয়ে স্টোরেজে সেভ করা
                $imageContent = file_get_contents($imageUrl);
                Storage::disk('public')->put('posts/' . $imageName, $imageContent);
                $imagePath = 'posts/' . $imageName;
            } catch (\Exception $e) {
                // যদি ডাউনলোড ফেইল করে তবে নাল থাকবে
                $imagePath = null;
                $this->command->error("Failed to download image for post $i");
            }

            // ডাটাবেসে পোস্ট ইনসার্ট
            Post::create([
                'user_id' => $user->id,
                'content' => "This is post number $i. " . Str::random(50),
                'image' => $imagePath,
                'visibility' => 'PUBLIC',
                'created_at' => now()->subMinutes($totalPosts - $i), // ক্রমানুসারে সময় সেট করা
                'updated_at' => now(),
            ]);

            $this->command->info("Seeded post $i of $totalPosts...");
        }

        $this->command->info('Successfully seeded 50 posts with local images!');
    }
}