<?php

namespace App\Http\Controllers;

use App\Models\EvenementHotel; // Assurez-vous que le modèle Evenements existe
use Illuminate\Http\Request;
use Illuminate\Http\Response;
class GestioTheatreController extends Controller
{
    /**
     * Récupérer tous les événements.
     */
    public function index()
    {
        try {
            $evenements = EvenementHotel::all();  // Récupère tous les événements
            return response()->json($evenements);  // Retourne les événements au format JSON
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération des événements: '.$e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de la récupération des événements.'
            ], 500);
        }
    }

    /**
     * Créer un événement.
     */
    public function store(Request $request)
    {
        try {
            // Validation des données reçues dans la requête
            $validated = $request->validate([
                'titre' => 'required|string|max:255',
                'lieu' => 'required|string|max:255',
                'prix' => 'required|numeric',
                'date' => 'required|date',
                'description' => 'required|string',
                'clientcibler' => 'required|boolean',
            ]);

            // Création de l'événement
            $evenement = EvenementHotel::create($validated);

            // Retourne une réponse JSON avec le nouvel événement créé
            return response()->json([
                'status' => 'success',
                'message' => 'Événement ajouté avec succès!',
                'evenement' => $evenement
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'ajout de l\'événement: '.$e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de l\'ajout de l\'événement.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Récupérer un événement spécifique.
     */
    public function show($id)
    {
        try {
            // Récupérer l'événement par ID
            $evenement = EvenementHotel::find($id);

            // Vérifier si l'événement existe
            if (!$evenement) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Événement non trouvé'
                ], Response::HTTP_NOT_FOUND);
            }

            // Retourner l'événement en JSON
            return response()->json([
                'status' => 'success',
                'evenement' => $evenement
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération de l\'événement: '.$e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de la récupération de l\'événement.',
            ], 500);
        }
    }

    /**
     * Mettre à jour un événement.
     */
    public function update(Request $request, $id)
    {
        try {
            // Récupérer l'événement par ID
            $evenement = EvenementHotel::find($id);

            // Vérifier si l'événement existe
            if (!$evenement) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Événement non trouvé'
                ], Response::HTTP_NOT_FOUND);
            }

            // Validation des données reçues pour la mise à jour
            $validated = $request->validate([
                'titre' => 'sometimes|required|string|max:255',
                'lieu' => 'sometimes|required|string|max:255',
                'prix' => 'sometimes|required|numeric',
                'date' => 'sometimes|required|date',
                'description' => 'sometimes|required|string',
                'clientcibler' => 'sometimes|required|boolean',
            ]);

            // Mise à jour de l'événement avec les nouvelles données
            $evenement->update($validated);

            // Retourner une réponse JSON avec l'événement mis à jour
            return response()->json([
                'status' => 'success',
                'message' => 'Événement mis à jour avec succès!',
                'evenement' => $evenement
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la mise à jour de l\'événement: '.$e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de la mise à jour de l\'événement.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Supprimer un événement.
     */
    public function destroy($id)
    {
        try {
            // Récupérer l'événement par ID
            $evenement = EvenementHotel::find($id);

            // Vérifier si l'événement existe
            if (!$evenement) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Événement non trouvé'
                ], Response::HTTP_NOT_FOUND);
            }

            // Supprimer l'événement
            $evenement->delete();

            // Retourner une réponse JSON avec un message de succès
            return response()->json([
                'status' => 'success',
                'message' => 'Événement supprimé avec succès!'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression de l\'événement: '.$e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de la suppression de l\'événement.',
            ], 500);
        }
    }
}
