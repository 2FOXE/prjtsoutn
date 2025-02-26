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
        Schema::create('equipements', function (Blueprint $table) {
            $table->id(); // ID auto-incrément
            $table->string('designation'); // Désignation
            $table->string('reference'); // Référence
            $table->text('fiche_technique')->nullable(); // Fiche Technique
            $table->text('mode_operatoire')->nullable(); // Mode Operatoire
            $table->unsignedBigInteger('zone');
            $table->date('date_place'); // Date de mise en Place
            $table->date('date_marche'); // Date de mise en marche
            $table->foreign('zone')->references('id')->on('zones');
            $table->string('photo')->nullable(); // Photo
            $table->timestamps(); // Created at & Updated at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipements');
    }
};
