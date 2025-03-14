<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReclamationChambreRequest extends FormRequest
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
            'reclamation_name' => 'required|string',  
            'reponse' => 'nullable|string',           
            'date_reclamation' => 'required|date',    
            'chambre_id' => 'required|integer|exists:chambres,id',
            'reclamation_id' => [
                'required',
                // 'exists:reclamations,id',
                // Rule::unique('reclamations_chambre')->ignore($this->route('reclamation_chambre')),
            ],
        ];
    }
}
