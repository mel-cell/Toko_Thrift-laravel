<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminUserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_username' => 'required|string|max:50|unique:users',
            'user_password' => 'required|string|min:6',
            'user_fullname' => 'required|string|max:100',
            'user_email' => 'required|string|email|max:50|unique:users',
            'user_level' => 'required|in:Admin,Pengguna',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'user_username' => $request->user_username,
            'user_password' => Hash::make($request->user_password),
            'user_fullname' => $request->user_fullname,
            'user_email' => $request->user_email,
            'user_level' => $request->user_level,
        ]);

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return $user;
    }

    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'user_username' => 'required|string|max:50|unique:users,user_username,' . $user->id,
            'user_fullname' => 'required|string|max:100',
            'user_email' => 'required|string|email|max:50|unique:users,user_email,' . $user->id,
            'user_level' => 'required|in:Admin,Pengguna',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->all());

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }
}
