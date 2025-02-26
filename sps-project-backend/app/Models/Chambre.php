<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chambre extends Model
{

    protected $table = 'chambres';
    protected $fillable = [
        "num_chambre",
        "type_chambre",
        "etage_id",
        "nb_lit",
        "nb_salle",
        "climat",
        "wifi",
        "vue_id",
    ];
    public function type_chambres()
{
    return $this->belongsTo(TypeChambre::class, 'type_chambres'); // Correct foreign key name
}

public function vue()
{
    return $this->belongsTo(Vue::class, 'vue_id'); // Matches 'vue_id' column in chambres table
}

public function etage()
{
    return $this->belongsTo(Etage::class, 'etage_id'); // Matches 'etage_id' column in chambres table
}


    use HasFactory;
}
