<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('types_chambre', function (Blueprint $table) {
            $table->id();
            $table->string('nom');  // Example column
            $table->integer('capacite'); // Example column
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('types_chambre');
    }
};

