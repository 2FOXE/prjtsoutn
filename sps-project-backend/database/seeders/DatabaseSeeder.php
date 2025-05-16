<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Seeders\TarifRepasSeeder;
use Database\Seeders\TarifActuelSeeder;
use Database\Seeders\TarifChambreSeeder;
use Database\Seeders\TarifReductionSeeder;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */

    public function run(): void
    {
        User::factory(1)->create([
            'prenom' => 'admin',
            'nom' => 'admin',
            'telephone' => '0600000000',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
        ]);
        $this->call([
            RegionSeeder::class,
            ZoneSeeder::class,
            ModePaimantsSeeder::class,
            AgentsSeeder::class,
            SecteurClientsSeeder::class,
            ClientSeeder::class,
            ModePaimantsSeeder::class,
            TarifRepasSeeder::class,
            TarifReductionSeeder::class,
            TarifChambreSeeder::class,
            TypeRepasSeeder::class,
            TypeReductionSeeder::class,
            TarifRepasDetailSeeder::class,
            TarifReductionDetailSeeder::class,
            TypeChambreSeeder::class,
            TarifActuelSeeder::class,
            ClientParticulierSeeder::class,
            VueSeeder::class,
            EtageSeeder::class,
            ChambreSeeder::class,
            TarifChambreDetailSeeder::class,
        ]);
    }
}
