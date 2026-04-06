<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
public function register(Request $request)
{
    // 1. Validation
    $validator = Validator::make($request->all(), [
        'first_name' => 'required|string|max:255',
        'last_name'  => 'required|string|max:255',
        'email'      => 'required|string|email|unique:users,email',
        'password'   => 'required|string|min:6|confirmed',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation failed',
            'errors'  => $validator->errors()
        ], 422);
    }

    // 2. Create user
    $user = User::create([
        'first_name' => $request->first_name,
        'last_name'  => $request->last_name,
        'email'      => $request->email,
        'password'   => Hash::make($request->password),
    ]);

    // 3. ✅ Most important part: Session-based login
    // This will set the laravel_session cookie in the browser
    Auth::login($user);

    // 4. Send response (no need to send token for session-based auth)
    return response()->json([
        'message' => 'Registration successful',
        'user'    => $user
    ], 201);
}

public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    $user = Auth::user();
    
    // Clear previous tokens
    $user->tokens()->delete();
    
    // Create new token
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message'      => 'Login successful',
        'access_token' => $token,
        'token_type'   => 'Bearer',
        'user'         => [
            'id'    => $user->id,
            'name'  => $user->first_name . ' ' . $user->last_name, // Adjust based on your fields
            'email' => $user->email,
        ]
    ]);
}

    public function logout(Request $request) 
    {
        try {
            $user = $request->user();

            if ($user) {
                // ১. Sanctum Token চেক: যদি টোকেন থাকে এবং ডিলিট করার মেথড থাকে
                $currentToken = $user->currentAccessToken();
                if ($currentToken && method_exists($currentToken, 'delete')) {
                    $currentToken->delete();
                }

                // ২. সেশন ভিত্তিক লগআউট (Web Guard)
                Auth::guard('web')->logout();
            }

            // ৩. সেশন এবং সিএসআরএফ টোকেন ইনভ্যালিড করা (নিরাপত্তার জন্য অত্যন্ত জরুরি)
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'status' => 'success',
                'message' => 'Logged out successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Logout failed: ' . $e->getMessage()
            ], 500);
        }
    }
}