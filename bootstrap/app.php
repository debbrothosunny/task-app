<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 1. Required to make Sanctum stateful
        $middleware->statefulApi();

        // 2. API routes don't need CSRF protection if using sessions,
        // but Sanctum handles this itself. No need to explicitly exclude 'api/*'.
        $middleware->validateCsrfTokens(except: [
            // Add only those routes here that will receive requests without cookies/sessions (e.g., Webhooks)
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();