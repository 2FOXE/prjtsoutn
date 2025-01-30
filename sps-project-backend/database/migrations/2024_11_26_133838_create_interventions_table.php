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
        Schema::create('interventions', function (Blueprint $table) {
            $table->id();
            $table->string('status');
            $table->string('type_intervention');
            $table->unsignedBigInteger('intervenant_id')->nullable();
            $table->unsignedBigInteger('prestataire_id')->nullable();
            $table->unsignedBigInteger('equipement_id')->nullable();
            $table->decimal("cout_prestation");
            $table->string('frequence');
            $table->text('commentaire');
            $table->string('duree_intervention');
            $table->date( 'date_interventions')->nullable();
            $table->foreign('prestataire_id')->references('id')->on('agents');
            $table->foreign('intervenant_id')->references('id')->on('intervenants');
            $table->foreign('equipement_id')->references('id')->on('equipements');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interventions');
    }
};
