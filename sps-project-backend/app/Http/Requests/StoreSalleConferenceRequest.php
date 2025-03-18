<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSalleConferenceRequest extends FormRequest
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
            'designation' => 'required|string|max:255|unique:salles_conference,designation',
            'capacite' => 'required|integer|min:1',
            'prix_heure' => 'required|numeric|min:0',
            'disponibilite' => 'boolean',
            'description' => 'nullable|string'
        ];
    }
}
