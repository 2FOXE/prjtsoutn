<?php
namespace App\Http\Controllers;

use App\Models\Chambre;
use App\Models\TypeChambre;
use App\Models\Vue;
use App\Models\Etage;
use Illuminate\Http\Request;

class ChambreController extends Controller
{
    public function getAll()
    {
        $chambres = Chambre::with(['typeChambre', 'vue', 'etage'])->get();
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

        $validatedData = $request->validate([
            'num_chambre' => 'required',
            'type_chambre' => 'required|integer',
            'etage_id' => 'required|integer',
            'nb_lit' => 'required|integer',
            'nb_salle' => 'required|integer',
            'climat' => 'required|in:oui,non',
            'wifi' => 'required|in:oui,non',
            'vue_id' => 'required|integer',
        ]);

        $chambre = Chambre::create($validatedData);
        return response()->json($chambre, 201);

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
            'num_chambre' => 'required',
            'type_chambre' => 'required|integer',
            'etage_id' => 'required|integer',
            'nb_lit' => 'required|integer',
            'nb_salle' => 'required|integer',
            'climat' => 'required|in:oui,non',
            'wifi' => 'required|in:oui,non',
            'vue_id' => 'required|integer',
        ]);

        $chambre->update($validatedData);

        return response()->json($chambre);
    }

    public function supprimerChambre(int $chambre_code)
    {
        $chambre = Chambre::findOrFail($chambre_code);
        $chambre->delete();

        return response()->json(['message' => 'Chambre deleted successfully']);
    }

    public function supprimerChambres()
    {
        Chambre::truncate();
        return response()->json(['message' => 'Chambres deleted successfully']);
    }
    public function store(Request $request)
{
    $validatedData = $request->validate([
        'num_chambre' => 'required',
        'type_chambre' => 'required|integer',
        'etage_id' => 'required|integer',
        'nb_lit' => 'required|integer',
        'nb_salle' => 'required|integer',
        'climat' => 'required|in:oui,non',
        'wifi' => 'required|in:oui,non',
        'vue_id' => 'required|integer',
    ]);

    $chambre = Chambre::create($validatedData);
    return response()->json($chambre, 201);
}

    
}
