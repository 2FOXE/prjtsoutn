<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('clientgrp', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id'); // Ensure this column exists
            $table->string('client_name');
            $table->string('client_email');
            $table->timestamps();

            // Foreign Key Constraint (Fixing the incorrect reference)
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientgrp');
    }
};

