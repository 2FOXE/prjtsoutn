<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDemandeReservationRequest extends FormRequest
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
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'telephone' => 'sometimes|string|max:20',
            'chambre_id' => 'sometimes|exists:chambres,id',
            'date_reservation' => 'sometimes|date',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'sometimes|date|after_or_equal:date_debut',
            'duree' => 'sometimes|integer|min:1',
            'nombre_personnes' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:en attende,confirmée,annulée',
            'montant_total' => 'sometimes|numeric|min:0'
        ];
    }
}
