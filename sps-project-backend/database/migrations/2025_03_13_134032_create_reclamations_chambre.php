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
        Schema::create('reclamations_chambre', function (Blueprint $table) {
            $table->id();
            $table->string('reclamation_name');
            $table->string('reponse');
            $table->date('date_reclamation');
            $table->unsignedBigInteger('chambre_id');
            $table->unsignedBigInteger('reclamation_id');
            $table->foreign('chambre_id')->references('id')->on('chambres')->onDelete('cascade');
            $table->foreign('reclamation_id')->references('id')->on('reclamations')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reclamations_chambre');
    }
};
