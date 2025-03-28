<?php
namespace App\Http\Controllers;

use App\Http\Requests\RegisterUserRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
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

    public function Register(RegisterUserRequest $request){
        $validatedData=$request->validated();
        $user=User::create($validatedData);

        // crèe une token a l‘aide de jwt
        $token=JWTAuth::fromUser($user);

        return  response()->json([
            "message"=>"register crèe avec succes",
            "user"=>$user,
            "token"=>$token
        ],201);


}

public function login(Request  $request){
    $request->validate([
        'email'=>'required|email',
        'password'=>'required',
    ]);
    $user=User::where("email",$request->email)->first();
    if(!$user){
        return response()->json([
            'errors'=>[
                'email'=>"email  incorect"
            ]
            ],404);
    }elseif(!Hash::check($request->password,$user->password)){
        return response()->json([
            'errors'=>[
                'password'=>"password  incorect"
            ]
            ],404);
    };
    $token=JWTAuth::fromUser($user);
    return  response()->json([
        'message'=>'login et rèusse',
        'user'=>$user,
        'token'=>$token],200); // 200 === reposne rèussie

}
}
