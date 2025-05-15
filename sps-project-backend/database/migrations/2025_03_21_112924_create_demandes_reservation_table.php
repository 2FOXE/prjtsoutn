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
        Schema::create('demandes_reservation', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email');
            $table->string('telephone');
            $table->foreignId('chambre_id')->constrained('chambres')->onDelete('cascade');
            $table->date('date_reservation');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->integer('duree');
            $table->integer('nombre_personnes');
            $table->enum('status', ['en attende', 'confirmée', 'annulée']);
            $table->decimal('montant_total', 10, 2); // Prix total de la réservation
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demandes_reservation');
    }
};
