<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceType extends Model
{
    protected $table = 'types_maintenance';

    protected $fillable = ['label'];

    // One type of maintenance can be linked to many room states
    public function etatChambres()
    {
        return $this->hasMany(EtatChambre::class, 'types_maintenance', 'id');
    }
}
