<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use Illuminate\Http\Request;

class DepartementController extends Controller
{
    // Afficher tous les départements
    public function index()
    {
        return response()->json(Departement::all(), 200);
    }

    // Afficher un département spécifique
    public function show($id)
    {
        $departement = Departement::find($id);
        
        if (!$departement) {
            return response()->json(['message' => 'Département non trouvé'], 404);
        }
        
        return response()->json($departement, 200);
    }

    // Créer un nouveau département
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|unique:departements,nom'
        ]);
        
        $departement = Departement::create($request->all());
        return response()->json($departement, 201);
    }

    // Mettre à jour un département
    public function update(Request $request, $id)
    {
        $departement = Departement::find($id);
        
        if (!$departement) {
            return response()->json(['message' => 'Département non trouvé'], 404);
        }
        
        $request->validate([
            'nom' => 'required|string|unique:departements,nom,' . $id
        ]);
        
        $departement->update($request->all());
        return response()->json($departement, 200);
    }

    // Supprimer un département
    public function destroy($id)
    {
        $departement = Departement::find($id);
        
        if (!$departement) {
            return response()->json(['message' => 'Département non trouvé'], 404);
        }
        
        $departement->delete();
        return response()->json(['message' => 'Département supprimé avec succès'], 200);
    }
}
