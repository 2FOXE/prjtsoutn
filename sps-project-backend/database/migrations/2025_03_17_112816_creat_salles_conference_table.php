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
        Schema::create('salles_conference', function (Blueprint $table) {
            $table->id();
            $table->string('designation');
            $table->integer('capacite')->default(0);
            $table->decimal('prix_heure',10,2);
            $table->boolean('disponibilite')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salles_conference');

    }
};
