<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "prenom"=>"required|min:4",
            "nom"=>"required|min:4",
            "telephone"=>"required",
            "email"=>"required|min:6|email|unique:users,email",
            "password"=>"required|min:4",

        ];
    }
}
