<?php

namespace App\Http\Controllers;

use App\Models\ReservEvenement;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReservEvenementController extends Controller
{
    /**
     * Afficher toutes les réservations.
     */
    public function index()
    {
        $reservations = ReservEvenement::all();
        return response()->json($reservations);
    }

    /**
     * Créer une nouvelle réservation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'idclient' => 'required|string',
            'idSpectacle' => 'required|integer',
            'prix' => 'required|numeric',
            'systemedepaiment' => 'required|string',
            'nombredesbilletts' => 'required|integer',
            'status' => 'required|string|in:en attente,confirmée,annulée',
        ]);

        $reservation = ReservEvenement::create($validated);

        return response()->json([
            'message' => 'Réservation créée avec succès.',
            'reservation' => $reservation
        ], Response::HTTP_CREATED);
    }

    /**
     * Afficher une réservation spécifique.
     */
    public function show($id)
    {
        $reservation = ReservEvenement::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Réservation non trouvée.'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($reservation);
    }

    /**
     * Mettre à jour une réservation.
     */
    public function update(Request $request, $id)
    {
        $reservation = ReservEvenement::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Réservation non trouvée.'], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'idclient' => 'sometimes|required|string',
            'idSpectacle' => 'sometimes|required|integer',
            'prix' => 'sometimes|required|numeric',
            'systemedepaiment' => 'sometimes|required|string',
            'nombredesbilletts' => 'sometimes|required|integer',
            'status' => 'sometimes|required|string|in:en attente,confirmée,annulée',
            "surface"=>"decimal",
            "Dimension"=>"decimal",
        ]);

        $reservation->update($validated);

        return response()->json([
            'message' => 'Réservation mise à jour avec succès.',
            'reservation' => $reservation
        ]);
    }

    /**
     * Supprimer une réservation.
     */
    public function destroy($id)
    {
        $reservation = ReservEvenement::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Réservation non trouvée.'], Response::HTTP_NOT_FOUND);
        }

        $reservation->delete();

        return response()->json(['message' => 'Réservation supprimée avec succès.']);
    }
}
