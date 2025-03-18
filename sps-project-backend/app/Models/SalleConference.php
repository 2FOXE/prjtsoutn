<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalleConference extends Model
{
    use HasFactory;


    protected $table='salles_conference';

    protected $fillable=[
        'designation',
        'capacite',
        'prix_heure',
        'disponibilite',
        'description'
    ];
}
