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
        Schema::create('suivi_interventions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('intervention');
            $table->unsignedBigInteger('prestataire');
            $table->unsignedBigInteger('equipement');
            $table->foreign('intervention')->references('id')->on('interventions');
            $table->foreign('prestataire')->references('id')->on('agents');
            $table->foreign('equipement')->references('id')->on('equipements');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suivi_interventions');
    }
};
