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
        Schema::table('demandes_reservation', function (Blueprint $table) {
            $table->string('adresse')->after('montant_total');
            $table->string('code_postal')->after('adresse');
            $table->text('demandes_speciales')->after('code_postal'); // Correction: text() au lieu de string()->text()
            $table->unsignedBigInteger('paimant_id')->nullable()->after('demandes_speciales'); // Ajout de nullable() si le paiement peut être optionnel
            $table->unsignedBigInteger('region_id')->nullable()->after('paimant_id'); // Ajout de nullable() si la région peut être optionnelle
            $table->unsignedBigInteger('ville_id')->nullable()->after('region_id'); // Ajout de nullable() si la ville peut être optionnelle

            // Ajout des clés étrangères
            $table->foreign('paimant_id')->references('id')->on('mode_paimants')->onDelete('cascade');
            $table->foreign('region_id')->references('id')->on('regions')->onDelete('cascade');
            $table->foreign('ville_id')->references('id')->on('villes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('demandes_reservation', function (Blueprint $table) {
            // Suppression des clés étrangères d'abord
            $table->dropForeign(['paimant_id']);
            $table->dropForeign(['region_id']);
            $table->dropForeign(['ville_id']);
            
            // Puis suppression des colonnes
            $table->dropColumn([
                'adresse',
                'code_postal',
                'demandes_speciales',
                'paimant_id',
                'region_id',
                'ville_id'
            ]);
        });
    }
};