<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReclamationChambreRequest;
use App\Http\Requests\UpdateReclamationChambreRequest;
use App\Models\ReclamationChambre;
use Illuminate\Http\Request;

class ReclamationChambreController extends Controller
{
    public function index()
    {
        return response()->json(ReclamationChambre::with(['reclamation','chambre'])->get(), 200);
    }

    public function show($id)
    {
        $reclamationChambre = ReclamationChambre::find($id);

        if (!$reclamationChambre) {
            return response()->json(['message' => 'Non trouvée.'], 404);
        }

        return response()->json([
            'message' => 'Réclamation récupérée.',
            'data' => $reclamationChambre
        ], 200);
    }

    public function store(StoreReclamationChambreRequest $request)
    {
        return response()->json([
            'message' => 'Créée avec succès.',
            'data' => ReclamationChambre::create($request->validated())
        ], 201);
    }

    public function update(UpdateReclamationChambreRequest $request, $id)
    {
        $reclamationChambre = ReclamationChambre::find($id);

        if (!$reclamationChambre) {
            return response()->json(['message' => 'Non trouvée.'], 404);
        }

        $reclamationChambre->update($request->validated());

        return response()->json([
            'message' => 'Mise à jour réussie.',
            'data' => $reclamationChambre
        ], 200);
    }

    public function destroy($id)
    {
        $reclamationChambre = ReclamationChambre::find($id);

        if (!$reclamationChambre) {
            return response()->json(['message' => 'Non trouvée.'], 404);
        }

        $reclamationChambre->delete();

        return response()->json(['message' => 'Supprimée avec succès.'], 200);
    }
}
