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
        Schema::create('details_reservation', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("reservation_id");
            $table->unsignedBigInteger("chambre_id");
            // Corrected table names:
            $table->foreign('reservation_id')->references('id')->on('reservations')->onDelete('cascade');
            $table->foreign('chambre_id')->references('id')->on('chambres')->onDelete('cascade');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('details_reservation');
    }
};
