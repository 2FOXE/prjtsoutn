<?php
namespace App\Http\Controllers;

use App\Models\Chambre;
use App\Models\TypeChambre;
use App\Models\Vue;
use App\Models\Etage;
use Illuminate\Http\Request;

class ChambreController extends Controller
{
    public function index()
    {
        try {
            $chambres = Chambre::with(['type_chambres', 'vue', 'etage'])->get();
            return response()->json(['chambres' => $chambres], 200);
        } catch (\Exception $e) {
            \Log::error('Error in index method:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    

public function getAll()
{
    $chambres = Chambre::with(['typeChambre', 'vue', 'etage'])->get(); // Fixed relation name
    $types = TypeChambre::all();
    $vues = Vue::all();
    $etages = Etage::all();

    return response()->json([
        'chambres' => $chambres,
        'types' => $types,
        'vues' => $vues,
        'etages' => $etages
    ]);
}

public function ajouterChambre(Request $request)
{
    // Debugging: Print incoming data
    \Log::info('Incoming Data:', $request->all());

    // Validate request
    $validatedData = $request->validate([
        'type_chambre' => 'required|integer', // Fixed key name
        'num_chambre' => 'required|integer|unique:chambres,num_chambre',
        'etage_id' => 'required|integer',
        'nb_lit' => 'required|integer',
        'nb_salle' => 'required|integer',
        'climat' => 'required|boolean', // Ensure climat is boolean
        'wifi' => 'required|boolean', // Ensure wifi is boolean
        'vue_id' => 'required|integer',
    ]);

    try {
        // Create new Chambre
        $chambre = Chambre::create($validatedData);
        return response()->json(['message' => 'Chambre ajoutée', 'chambre' => $chambre], 201);
    } catch (\Exception $e) {
        \Log::error('Error creating chambre:', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'Erreur lors de l\'ajout'], 500);
    }
}

    public function afficherChambre(int $chambre_code)
    {
        $chambre = Chambre::findOrFail($chambre_code);
        return response()->json($chambre);
    }

    public function updateChambre(Request $request, int $chambre_code)
    {
        $chambre = Chambre::findOrFail($chambre_code);
        
        $validatedData = $request->validate([
            'num_chambre' => 'required|integer',
            'type_chambre' => 'required|integer', // Fix type
            'etage_id' => 'required|integer',
            'nb_lit' => 'required|integer',
            'nb_salle' => 'required|integer',
            'climat' => 'required|boolean', // Should be boolean
            'wifi' => 'required|boolean', // Fix this to boolean
            'vue_id' => 'required|integer',
        ]);
    
        $chambre->update($validatedData);
    
        return response()->json(['message' => 'Chambre mise à jour avec succès', 'chambre' => $chambre]);
    }
    

    public function supprimerChambre(int $id) // Change variable name
{
    $chambre = Chambre::findOrFail($id);
    $chambre->delete();

    return response()->json(['message' => 'Chambre supprimée avec succès']);
}

    public function supprimerChambres()
    {
        Chambre::truncate();
        return response()->json(['message' => 'Chambres deleted successfully']);
    }
}
