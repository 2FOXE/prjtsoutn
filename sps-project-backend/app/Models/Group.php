<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;
    protected $table = 'groups';

    public function clientgrp()
    {
        return $this->hasMany(Clientgrp::class);
    }

    public function clientParticulier()
    {
        return $this->belongsTo(ClientParticulier::class);
    }

}

