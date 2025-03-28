<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDemandeReservationRequest extends FormRequest
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
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telephone' => 'required|string|max:20',
            'chambre_id' => 'required|exists:chambres,id',
            'date_reservation' => 'required|date',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'duree' => 'required|integer|min:1',
            'nombre_personnes' => 'required|integer|min:1',
            'status' => 'in:en attende,confirmée,annulée',
            'montant_total' => 'required|numeric|min:0',
            'adresse' => 'string|max:255',
            'code_postal' => 'string|max:10',
            'demandes_speciales' => 'nullable|string',
            'paimant_id' => 'required|exists:mode_paimants,id',
            'region_id' => 'required|exists:regions,id',
            'ville_id' => 'required|exists:villes,id'
        ];
    }
}
