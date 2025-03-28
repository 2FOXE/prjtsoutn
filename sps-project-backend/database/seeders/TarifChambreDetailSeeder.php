<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class TarifChambreDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tarif_chambre_detail')->insert([
            [
                'code' => 'Code 1',
                'chambre_id' => 1,
                'tarif_chambre' => 1, // Foreign key to tarif_chambre_detail
                'type_chambre' => 1,   // Foreign key to types_chambre
                'single' => 100.00,
                'double' => 150.00,
                'triple' => 200.00,
                'lit_supp' => 25,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'Code 2',
                'chambre_id' => 2,
                'tarif_chambre' => 2,
                'type_chambre' => 2,
                'single' => 120.00,
                'double' => 170.00,
                'triple' => 220.00,
                'lit_supp' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'Code 3',
                'chambre_id' => 3,
                'tarif_chambre' => 3,
                'type_chambre' => 3,
                'single' => 140.00,
                'double' => 190.00,
                'triple' => 240.00,
                'lit_supp' => 35,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
