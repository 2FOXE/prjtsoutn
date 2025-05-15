<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvenementHotel extends Model
{
    use HasFactory;
   protected $table='evenments';
   protected $fillable=[
   'titre',
    'lieu',
    'description',
    'date',
    'prix',
    'clientcibler']
   ;


}
