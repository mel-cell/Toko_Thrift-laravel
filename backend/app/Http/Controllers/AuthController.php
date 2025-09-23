<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $rules = [
            'user_username' => 'required|string|max:50|unique:users',
            'user_password' => 'required|string|min:8',
            'user_fullname' => 'required|string|max:100',
            'user_email' => 'required|string|email|max:50|unique:users',
            'user_nohp' => 'required|string|max:13',
            'user_alamat' => 'required|string|max:200',
            'user_level' => 'sometimes|in:Admin,Pengguna', // Optional, defaults to Pengguna
        ];

        // Strict validation for Admin users
        if ($request->user_level === 'Admin') {
            $rules['user_password'] = 'required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/';
            $rules['user_email'] = 'required|string|email|max:50|unique:users|regex:/@tugva\.org$/';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'user_username' => $request->user_username,
            'user_password' => $request->user_password,
            'user_fullname' => $request->user_fullname,
            'user_email' => $request->user_email,
            'user_nohp' => $request->user_nohp,
            'user_alamat' => $request->user_alamat,
            'user_level' => $request->user_level ?? 'Pengguna', // Default to Pengguna if not provided
        ]);

        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_username' => 'required|string',
            'user_password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('user_username', $request->user_username)->first();

        if (!$user || !Hash::check($request->user_password, $user->user_password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('user_email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Generate token
        $token = Str::random(60);
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['token' => $token, 'created_at' => now()]
        );

        // Send email (placeholder)
        // Mail::to($user->user_email)->send(new ResetPasswordMail($token));

        return response()->json(['message' => 'Password reset link sent']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $reset = DB::table('password_reset_tokens')->where('email', $request->email)->where('token', $request->token)->first();
        if (!$reset) {
            return response()->json(['message' => 'Invalid token'], 400);
        }

        $user = User::where('user_email', $request->email)->first();
        $user->update(['user_password' => Hash::make($request->password)]);

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password reset successfully']);
    }
}
