<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; 

class ClientGrp extends Model
{
    use HasFactory;
    protected $table = 'clientgrp';
    public $timestamps = true;


    protected $fillable = [
        'group_id',
        'id',
        'nom',
        'prenom',
        'email',
        'cin'
    ];
}
