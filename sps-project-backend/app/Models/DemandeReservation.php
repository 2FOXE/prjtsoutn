<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeReservation extends Model
{
    use HasFactory;

    protected $table = "demandes_reservation";


    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'chambre_id',
        'date_reservation',
        'date_debut',
        'date_fin',
        'duree',
        'nombre_personnes',
        'status',
        'montant_total',
        'adresse',
        'code_postal',
        'ville_id',
        'region_id',
        'demandes_speciales',
        'paimant_id',
        'user_id',


    ];

    public function chambre()
    {
        return $this->belongsTo(Chambre::class);
    }
}
