<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            // "Nombre de réservation"
            // This field stores a unique number (or string) that identifies the reservation.
            $table->string('reservation_number')->unique();

            // "Client": foreign key to the clients table.
            // (Assuming you will create or already have a "clients" table with an id column)
            $table->unsignedBigInteger('client_id');

            // "Nombre chambre": foreign key to the chambres table.
            $table->unsignedBigInteger('chambre_id');

            // "Date de réservation": the date when the reservation was made.
            $table->date('reservation_date');

            // "Date début": the start date of the reservation.
            $table->date('date_debut');

            // "Date fin": the end date of the reservation.
            $table->date('date_fin');
            
            // "Client type": the type of client (e.g., individual or company)
            $table->string('client_type');  

            $table->string('status');



            $table->timestamps();

            // Foreign key constraints:
            $table->foreign('chambre_id')->references('id')->on('chambres')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};