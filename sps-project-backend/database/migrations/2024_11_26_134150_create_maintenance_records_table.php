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
        Schema::create('maintenance_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('intervention');
            $table->string('desc_intervention');
            $table->boolean('nettoyage_outils')->default(false);
            $table->boolean('nettoyage_ligne')->default(false); // For "Nettoyage de la ligne après intervention"
            $table->boolean('liberation_ligne')->default(false); // For "Libération de la ligne"
            $table->string('visa_responsables');
            $table->foreign('intervention')->references('id')->on('interventions');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_records');
    }
};
