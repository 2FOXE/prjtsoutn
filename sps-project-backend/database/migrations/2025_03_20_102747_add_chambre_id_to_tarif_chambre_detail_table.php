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
        Schema::table('tarif_chambre_detail', function (Blueprint $table) {
            $table->unsignedBigInteger('chambre_id')->after('code');

            // Puis ajouter la clé étrangère
            $table->foreign('chambre_id')->references('id')->on('chambres')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tarif_chambre_detail', function (Blueprint $table) {
            //
        });
    }
};
