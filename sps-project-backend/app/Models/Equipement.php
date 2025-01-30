<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipement extends Model
{
    use HasFactory;

    // Nom de la table associée au modèle (optionnel si le nom suit la convention)
    protected $table = 'equipements';

    // Les attributs qui peuvent être remplis en masse
    protected $fillable = [
        'designation',
        'reference',
        'fiche_technique',
        'mode_operatoire',
        'zone',
        'date_place',
        'date_marche',
        'photo',
        // 'user_id', // s'il y a un lien vers l'utilisateur qui a créé l'équipement
    ];

    // Les attributs qui devraient être castés à des types natifs
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relation avec le modèle User si l’utilisateur est lié à l’équipement
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function intervention()
    {
        return $this->hasMany(Intervention::class, 'equipement_id');
    }

    public function zone() {
        return $this->belongsTo(Zone::class, 'zone');
    }

    public function suivi_intervention() {
        return $this->hasMany(SuiviIntervention::class, 'equipement');
    }

}
