<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reclamation;
use App\Models\Historique; // Ensure correct model is used
use App\Models\Departement;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReclamationSeeder extends Seeder
{
    public function run()
    {
        // ✅ Disable foreign key checks to prevent issues
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // ✅ Truncate tables in correct order
        Historique::truncate();  // Delete historique first
        Reclamation::truncate(); // Then delete reclamations

        // ✅ Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Mapping suivi statuses to descriptions
        $statusOptions = [
            'En attente' => 'Réclamation soumise, en attente de traitement.',
            'En cours' => 'Réclamation en cours de traitement.',
            'Traité' => 'Réclamation traitée avec une réponse donnée.',
            'Résolu' => 'Réclamation entièrement résolue.',
        ];

        // Retrieve all departements
        $departements = Departement::pluck('nom', 'id');

        // Sample reclamations
        $reclamations = [
            [
                'type_reclamation' => 'Problème de propreté',
                'reclamer_a_travers' => 'Email',
                'departement_id' => 2, // Service de ménage
                'suivi' => 'En attente',
                'reponse' => null,
            ],
            [
                'type_reclamation' => 'Panne d\'ascenseur',
                'reclamer_a_travers' => 'Téléphone',
                'departement_id' => 3, // Maintenance
                'suivi' => 'En cours',
                'reponse' => 'Technicien envoyé pour réparation.',
            ],
            [
                'type_reclamation' => 'Chauffage non fonctionnel',
                'reclamer_a_travers' => 'Application mobile',
                'departement_id' => 3, // Maintenance
                'suivi' => 'Traité',
                'reponse' => 'Chauffage réparé par le technicien.',
            ],
            [
                'type_reclamation' => 'Problème de facturation',
                'reclamer_a_travers' => 'Support en ligne',
                'departement_id' => 1, // Réception
                'suivi' => 'Résolu',
                'reponse' => 'Erreur corrigée et facture ajustée.',
            ],
            [
                'type_reclamation' => 'Nourriture froide au restaurant',
                'reclamer_a_travers' => 'Formulaire papier',
                'departement_id' => 4, // Restauration
                'suivi' => 'En attente',
                'reponse' => null,
            ]
        ];

        // Insert reclamations and generate historique automatically
        foreach ($reclamations as $reclamationData) {
            // Fetch departement name dynamically
            $reclamationData['departement_affecte'] = $departements[$reclamationData['departement_id']] ?? 'Non spécifié';

            // Insert into reclamations table
            $reclamation = Reclamation::create($reclamationData);

            // Insert into historique table using correct model
            Historique::create([
                'reclamation_id' => $reclamation->id,
                'date' => Carbon::now(),
                'description' => $statusOptions[$reclamationData['suivi']], // Auto description based on suivi
            ]);
        }
    }
}
