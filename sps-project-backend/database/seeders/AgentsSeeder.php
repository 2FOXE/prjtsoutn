<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AgentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('agents')->insert([
            [
                'NomAgent' => 'Dupont',
                'PrenomAgent' => 'Jean',
                'SexeAgent' => 'Masculin',
                'EmailAgent' => 'jean.dupont@example.com',
                'TelAgent' => '0601234567',
                'AdresseAgent' => '10 rue de Paris',
                'VilleAgent' => 'Paris',
                'CodePostalAgent' => '75001',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'NomAgent' => 'Martin',
                'PrenomAgent' => 'Marie',
                'SexeAgent' => 'Feminin',
                'EmailAgent' => 'marie.martin@example.com',
                'TelAgent' => '0609876543',
                'AdresseAgent' => '20 avenue de Lyon',
                'VilleAgent' => 'Lyon',
                'CodePostalAgent' => '69001',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
