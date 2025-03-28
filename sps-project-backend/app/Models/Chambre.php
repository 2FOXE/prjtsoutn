<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chambre extends Model
{
    use HasFactory;

    protected $table = 'chambres';
    protected $primaryKey = 'id';

    protected $fillable = [
        'num_chambre',
        'type_chambre',
        'nb_lit',
        'nb_salle',
        'climat',
        'wifi',
        'vue_id',  // Foreign key to the Vue model
        'etage_id',
    ];


    //  relation de reclamation chambres 
    public  function reclamationsChambre(){
        return  $this->hasMany(ReclamationChambre::class);
    }


    /**
     * Define the relationship to the `TypeChambre` model.
     * The `Chambre` model has one `TypeChambre` record.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function typeChambre()
    {
        return $this->belongsTo(TypeChambre::class, 'type_chambre', 'id');
    }
    
    public function type_chambre() {
        return $this->belongsTo(TypeChambre::class, 'type_chambre_id');
    }
    public function tarifChambreDetail() {
        return $this->hasOne(TarifChambreDetail::class, 'chambre_id', 'id');
    }
    public function demande_reservation() {
        return $this->hasMany(DemandeReservation::class);
    }


    /**
     * Define the relationship to the `Vue` model.
     * The `Chambre` model has one `Vue` record.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function vue()
    {
        return $this->belongsTo(Vue::class, 'vue_id', 'id');  // Assuming vue_id is the foreign key
    }

    /**
     * Define the relationship to the `Etage` model.
     * The `Chambre` model has one `Etage` record.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function etage()
    {
        return $this->belongsTo(Etage::class, 'etage_id', 'id');  // Assuming etage_id is the foreign key
    }

    /**
     * Define the relationship to the `EtatChambre` model.
     * The `Chambre` model has many related `EtatChambre` records.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function etatChambres()
    {
        return $this->hasMany(EtatChambre::class, 'num_chambre', 'num_chambre');
    }

            public function reservations()
        {
            return $this->belongsToMany(Reservation::class, 'details_reservation');
        }

}
