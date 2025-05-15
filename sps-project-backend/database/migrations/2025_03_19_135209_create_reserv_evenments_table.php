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
        Schema::create('reserv_evenments', function (Blueprint $table) {
            $table->bigIncrements('id'); // ✅ Clé primaire auto-incrémentée
            $table->string('idclient'); // ID du client (peut être un matricule ou numéro)
            $table->integer('idSpectacle'); // ID du spectacle (non relié à une clé étrangère ici)
            $table->decimal('prix', 8, 2); // Prix avec 2 décimales
            $table->string('systemedepaiment'); // Mode de paiement (espèces, carte, etc.)
            $table->integer('nombredesbilletts'); // Nombre de billets réservés
            $table->string('status'); // Statut (tu peux le convertir en ENUM si tu veux)
            $table->timestamps(); // Champs created_at et updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reserv_evenments');
    }
};
