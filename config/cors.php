<?php

return [

    'paths' => [
        'api/*', 
        'sanctum/csrf-cookie', 
        'login', 
        'logout', 
        'register' 
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter([  // array_filter removes null values
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:8000',    
        'http://127.0.0.1:8000',
        env('FRONTEND_URL'),         // make sure this is set in Railway!
    ]),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,   
];