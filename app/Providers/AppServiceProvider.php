<?php

namespace App\Providers;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        RateLimiter::for('social_actions', function (Request $request) {
            $identifier = $request->user()?->id ?: $request->ip();

            // UX: Give more room for likes, but tighten the belt on actual POSTING
            if ($request->isMethod('post') && $request->routeIs('posts.store')) {
                return Limit::perMinute(10)->by($identifier)
                    ->response(fn() => response()->json(['message' => 'Slow down! You are posting too frequently.'], 429));
            }

            // Default for likes/comments
            return Limit::perMinute(100)->by($identifier);
        });
    }
}
