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
        Schema::table('chambres', function (Blueprint $table) {
            $table->string('wifi')->default('non')->change(); // Change from integer to string
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chambres', function (Blueprint $table) {
            $table->boolean('wifi')->default(0)->change(); // Revert back to boolean
        });
    }
};
