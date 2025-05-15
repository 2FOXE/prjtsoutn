<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reserv_evenments', function (Blueprint $table) {
            $table->decimal('surface', 8, 2)->nullable()->after('nombredesbilletts');
            $table->decimal('Dimension', 8, 2)->nullable()->after('surface');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reserv_evenments', function (Blueprint $table) {
            $table->dropColumn(['surface', 'Dimension']);
        });
    }
};
