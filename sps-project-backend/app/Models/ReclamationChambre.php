<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReclamationChambre extends Model
{

    use HasFactory;
    protected $table="reclamations_chambre";

    protected $fillable=[
        'reclamation_name',
        'reponse',
        'date_reclamation',
        'chambre_id',
        'reclamation_id',
    ];

    public function reclamation(){
        return  $this->belongsTo(Reclamation::class);
    }


    public function chambre(){
        return  $this->belongsTo(Chambre::class);
    }
}
