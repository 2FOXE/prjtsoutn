<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservEvenement extends Model
{
    use HasFactory;

    /**
     * Nom de la table associée.
     */
    protected $table = 'reserv_evenments';

    /**
     * Clé primaire (par défaut c’est "id", donc cette ligne est optionnelle ici).
     */
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    /**
     * Les champs remplissables automatiquement.
     */
    protected $fillable = [
        'idclient',
        'idSpectacle',
        'prix',
        'systemedepaiment',
        'nombredesbilletts',
        'status',
    ];

    /**
     * (Optionnel) Si tu veux ajouter une relation avec une table "evenments"
     */
    public function spectacle()
    {
        return $this->belongsTo(Evenment::class, 'idSpectacle');
    }
}
