<?php

namespace App\Http\Controllers;

use App\Models\Reclamation;
use App\Models\Historique;
use App\Models\Departement;
use Illuminate\Http\Request;
use Exception;

class ReclamationController extends Controller
{
    // Créer une réclamation
    public function create(Request $request)
    {
        try {
            $data = $request->validate([
                'type_reclamation' => 'required|string|max:255',
                'reclamer_a_travers' => 'required|string|max:255',
                'departement_id' => 'required|exists:departements,id',
                'suivi' => 'required|string|in:En cours,En attente,Traité,Résolu',
                'date' => 'required|date',
            ]);

            $reclamation = Reclamation::create($data);

            // Ajouter une entrée dans l'historique
            $reclamation->historique()->create([
                'date' => now(),
                'description' => 'Réclamation reçue et en cours d\'examen',
            ]);

            return response()->json([
                'message' => 'Réclamation créée avec succès',
                'data' => $reclamation
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Échec de la création de la réclamation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Récupérer toutes les réclamations
    public function index()
    {
        try {
            $reclamations = Reclamation::with(['historique', 'departement'])->get();
            return response()->json($reclamations);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Impossible de récupérer les réclamations',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Mettre à jour une réclamation
    public function update(Request $request, $id)
    {
        try {
            $reclamation = Reclamation::findOrFail($id);
            $data = $request->validate([
                'type_reclamation' => 'nullable|string|max:255',
                'reclamer_a_travers' => 'nullable|string|max:255',
                'departement_id' => 'nullable|exists:departements,id',
                'suivi' => 'nullable|string',
                'reponse' => 'nullable|string',
                'date' => 'required|date',
            ]);

            $reclamation->update($data);

            // Ajouter à l'historique
            $reclamation->historique()->create([
                'date' => now(),
                'description' => 'Réclamation mise à jour',
            ]);

            return response()->json([
                'message' => 'Réclamation mise à jour avec succès',
                'data' => $reclamation
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Échec de la mise à jour de la réclamation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Supprimer une réclamation
    public function destroy($id)
    {
        try {
            $reclamation = Reclamation::findOrFail($id);
            $reclamation->delete();

            return response()->json([
                'message' => 'Réclamation supprimée avec succès'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Échec de la suppression de la réclamation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Récupérer tous les départements
    public function getDepartments()
    {
        try {
            return response()->json(Departement::all());
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Impossible de récupérer les départements',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Ajouter un département
    public function addDepartment(Request $request)
    {
        try {
            $request->validate([
                'nom' => 'required|string|unique:departements,nom|max:255',
            ]);

            $departement = Departement::create(['nom' => $request->nom]);

            return response()->json([
                'message' => 'Département ajouté avec succès',
                'data' => $departement
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Échec de l\'ajout du département',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Mettre à jour un département
    public function updateDepartment(Request $request, $id)
    {
        try {
            $request->validate([
                'nom' => 'required|string|unique:departements,nom|max:255',
            ]);

            $departement = Departement::findOrFail($id);
            $departement->update(['nom' => $request->nom]);

            return response()->json([
                'message' => 'Département mis à jour avec succès',
                'data' => $departement
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Échec de la mise à jour du département',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Supprimer un département
    public function deleteDepartment($id)
    {
        try {
            $departement = Departement::findOrFail($id);
            $departement->delete();

            return response()->json([
                'message' => 'Département supprimé avec succès'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Échec de la suppression du département',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
