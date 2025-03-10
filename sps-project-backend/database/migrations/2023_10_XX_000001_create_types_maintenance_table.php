<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTypesMaintenanceTable extends Migration
{
    public function up()
    {
        Schema::create('types_maintenance', function (Blueprint $table) {
            $table->id(); // 'id' is the primary key
            $table->string('label');
            $table->timestamps();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('types_maintenance');
    }
}
