<?php

namespace App\Http\Controllers;

use App\Models\EtatChambre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class EtatChambreController extends Controller
{
    public function index()
    {
        try {
            $chambres = EtatChambre::with('maintenanceType')->get();
            return response()->json(['chambres' => $chambres], 200);
        } catch (\Exception $e) {
            Log::error("Erreur lors de la récupération des chambres: " . $e->getMessage());
            return response()->json(['error' => 'Erreur interne du serveur', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($num_chambre)
    {
        try {
            $chambre = EtatChambre::with('maintenanceType')
                ->where('num_chambre', $num_chambre)
                ->first();

            if (!$chambre) {
                return response()->json([
                    'message' => 'Chambre non trouvée',
                    'num_chambre' => $num_chambre
                ], 404);
            }

            return response()->json($chambre, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur interne', 'details' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'num_chambre' => 'required|exists:chambres,num_chambre',
                'status' => 'required|in:nettoyée,non nettoyée',
                'date_nettoyage' => 'nullable|date',
                'nettoyée_par' => 'nullable|string',
                'maintenance' => 'boolean',
                'types_maintenance' => 'nullable|exists:types_maintenance,id',
                'date_debut_maintenance' => 'nullable|date|required_if:maintenance,true',
                'date_fin_maintenance' => 'nullable|date|required_if:maintenance,true',
                'commentaire' => 'nullable|string',
            ]);

            $etatChambre = EtatChambre::create($validated);

            return response()->json([
                'message' => 'État de chambre créé avec succès!',
                'etat_chambre' => $etatChambre
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation échouée',
                'messages' => $e->errors(),
                'data_sent' => $request->all()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur interne',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $num_chambre)
    {
        try {
            $chambre = EtatChambre::where('num_chambre', $num_chambre)->first();

            if (!$chambre) {
                return response()->json(['message' => 'Chambre non trouvée', 'num_chambre' => $num_chambre], 404);
            }

            $validated = $request->validate([
                'status' => 'nullable|string',
                'date_nettoyage' => 'nullable|date',
                'nettoyée_par' => 'nullable|string',
                'maintenance' => 'nullable|boolean',
                'types_maintenance' => 'nullable|exists:types_maintenance,id',
                'date_debut_maintenance' => 'nullable|date|required_if:maintenance,true',
                'date_fin_maintenance' => 'nullable|date|required_if:maintenance,true',
                'commentaire' => 'nullable|string',
            ]);

            $chambre->update($validated);

            return response()->json([
                'message' => 'État de chambre mis à jour avec succès!',
                'etat_chambre' => $chambre
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation échouée',
                'messages' => $e->errors(),
                'data_sent' => $request->all()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur interne',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($num_chambre)
    {
        try {
            $chambre = EtatChambre::where('num_chambre', $num_chambre)->first();

            if (!$chambre) {
                return response()->json([
                    'message' => 'Chambre non trouvée',
                    'num_chambre' => $num_chambre
                ], 404);
            }

            $chambre->delete();

            return response()->json(['message' => 'Chambre supprimée avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur interne',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
