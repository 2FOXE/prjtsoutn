<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; 

class Clientgrp extends Model
{
    use HasFactory;
    protected $table = 'clientgrp';
    public $timestamps = true;


    protected $fillable = [
        'id',
        'nom',
        'prenom',
        'email',
        'cin'
    ];
}
