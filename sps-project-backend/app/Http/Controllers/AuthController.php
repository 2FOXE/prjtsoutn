<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterUserRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // public function login(Request $request)
    // {
    //     $request->validate([
    //         'email' => 'required|email',
    //         'password' => 'required|min:6',
    //     ]);

    //     $user = User::where('email', $request->email)->first();

    //     if (!$user || !Hash::check($request->password, $user->password)) {
    //         throw ValidationException::withMessages([
    //             'email' => ['These credentials do not match our records.'],
    //         ]);
    //     }

    //     // Create a new token for the user
    //     $token = $user->createToken('YourAppName')->plainTextToken;

    //     return response()->json([
    //         'token' => $token,
    //     ]);
    // }

    public function Register(RegisterUserRequest $request)
    {
        $validatedData = $request->validated();
        $user = User::create($validatedData);

        // crèe une token a l‘aide de jwt
        $token = JWTAuth::fromUser($user);

        return  response()->json([
            "message" => "register crèe avec succes",
            "user" => $user,
            "token" => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'errors' => [
                    "email" => 'email incorcet'
                ]
            ], 404);
        } elseif (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'errors' => [
                    "password" => "password incorcet"
                ]
            ], 404); // 401 == non autorisè
        }
        $token = JWTAuth::fromUser($user);

        return  response()->json([
            'message' => 'login et rèusse',
            'user' => $user,
            'token' => $token
        ], 200); // 200 === reposne rèussie
    }



    public function Logout(Request $request)
    {
        try {

            $token = JWTAuth::getToken();
            if (!$token) {
                return  response()->json(['error' => 'token not provided'], 404);
            }
            JWTAuth::invalidate($token); // logout en invlide le token pour ne pas faie
            return  response()->json(['message' => 'logout est réussie'], 200);
        } catch (\tymon\JWTAuth\Exceptions\JWTException  $e) {
            return response()->json(['error' => 'lougout ne pas rèussie'], 404);
        }
    }
}
