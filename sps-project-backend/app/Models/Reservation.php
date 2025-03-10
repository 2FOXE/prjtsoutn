<?php
   
   namespace App\Models;
   
   use Illuminate\Database\Eloquent\Factories\HasFactory;
   use Illuminate\Database\Eloquent\Model;
   
   class Reservation extends Model
   {
       use HasFactory;
   
       protected $table = "reservations";
       protected $fillable = [
        'reservation_num',
        'client_id',
        'client_type',
        'chambre_id',
        'reservation_date',
        'date_debut',
        'date_fin',
        'montant_total',
        'status'       
     ];

       // Automatically append the client_data attribute when serializing.
       protected $appends = ['client_data'];

       // Accessor to fetch complete client information
       public function getClientDataAttribute()
       {
           if ($this->client_type === 'societe') {
               return \App\Models\Client::find($this->client_id);
           } else {
               return \App\Models\ClientParticulier::find($this->client_id);
           }
       }
       
       public function chambres()
{
    return $this->belongsToMany(Chambre::class, 'details_reservation');
}

   }