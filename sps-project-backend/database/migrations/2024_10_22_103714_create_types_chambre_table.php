<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('types_chambre', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Code unique de la chambre
            $table->string('type_chambre'); // Type de chambre
            $table->integer('nb_lit'); // Nombre de lits
            $table->integer('nb_salle'); // Nombre de salles de bain
            $table->text('commentaire')->nullable(); // Commentaire optionnel
            $table->string('nom')->nullable();  // Example column
            $table->integer('capacite')->nullable(); 
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('types_chambre');
    }
};
