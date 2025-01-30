<?php

namespace App\Http\Controllers;

use App\Models\Zone;
use App\Models\Equipement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\AgentController;
use Illuminate\Support\Facades\Validator;

class EquipementController extends Controller
{
    public function index()
    {
        // if (Gate::allows('view_all_equipements')) {
                $equipements = Equipement::with(['zone', 'intervention'])->get();
                $count = Equipement::count();
                $zones = Zone::all();

                return response()->json([
                    'message' => 'Liste des équipements récupérée avec succès',
                    'equipements' => $equipements,
                    'zones' => $zones,
                    'count' => $count
                ], 200);

        // } else {
        //     abort(403, 'Vous n\'avez pas l\'autorisation de voir la liste des équipements.');
        // }
    }

    public function store(Request $request)
    {
        // if (Gate::allows('create_equipements')) {
                $validatedData = $request->validate([
                    'designation' => 'required|string',
                    'reference' => 'required|string|unique:equipements,reference',
                    'fiche_technique' => 'nullable|file|mimes:pdf|max:2048',
                    'mode_operatoire' => 'nullable|file|mimes:pdf|max:2048',
                    'zone' => 'required|exists:zones,id|integer',
                    'date_place' => 'required',
                    'date_marche' => 'required',
                    'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                ]);

                // Storing Fiche Technique
                $photo = $request->file('fiche_technique');
                // Deleting Old Photo and Inserting The New Photo
                if ($request->hasFile('fiche_technique')) {
                    // Storage::disk('public')->delete($tarifRepas->photo);
                    $photoPath = $photo->storeAs('fiche_technique', time() . '_' . $photo->getClientOriginalName(), 'public');
                    $validatedData['fiche_technique'] = $photoPath;
                }
                if ($request->hasFile('mode_operatoire')) {
                    $modeOperatoire = $request->file('mode_operatoire');
                    $modeOperatoirePath = $modeOperatoire->storeAs('mode_operatoire', time() . '_' . $modeOperatoire->getClientOriginalName(), 'public');
                    $validatedData['mode_operatoire'] = $modeOperatoirePath;
                }



                // Storing Photo
                $photo = $request->file('photo');
                if ($request->hasFile('photo')) {
                    // Storage::disk('public')->delete($tarifRepas->photo);
                    $photoPath = $photo->storeAs('equipements', time() . '_' . $photo->getClientOriginalName(), 'public');
                    $validatedData['photo'] = $photoPath;
                }

                $equipement = Equipement::create($validatedData);

                return response()->json([
                    'message' => 'Équipement ajouté avec succès',
                    'equipement' => $equipement,
                ], 200);

        // } else {
        //     abort(403, 'Vous n\'avez pas l\'autorisation d\'ajouter des équipements.');
        // }
    }

    public function update(Request $request, $id)
    {
        // if (Gate::allows('update_equipements')) {
                $equipement = Equipement::findOrFail($id);
                $validatedData = $request->validate([
                    'designation' => 'string',
                    'reference' => 'string|unique:equipements,reference,' . $id,
                    'fiche_technique' => 'nullable|file|mimes:pdf|max:2048',
                    'mode_operatoire' => 'nullable|file|mimes:pdf|max:2048',
                    'zone' => 'required|exists:zones,id|integer',
                    'date_place' => 'required',
                    'date_marche' => 'required',
                    'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                ]);

                $photo = $request->file('fiche_technique');
                // Deleting Old Photo and Inserting The New Photo
                if ($request->hasFile('fiche_technique')) {
                    if (!empty($equipement->fiche_technique))
                    Storage::disk('public')->delete($equipement->fiche_technique);
                    $photoPath = $photo->storeAs('fiche_technique', time() . '_' . $photo->getClientOriginalName(), 'public');
                    $validatedData['fiche_technique'] = $photoPath;
                }
                      // Storing Mode Operatoire
                  if ($request->hasFile('mode_operatoire')) {
                      if (!empty($equipement->mode_operatoire)) {
                      Storage::disk('public')->delete($equipement->mode_operatoire);
        }
        $modeOperatoire = $request->file('mode_operatoire');
        $modeOperatoirePath = $modeOperatoire->storeAs('mode_operatoire', time() . '_' . $modeOperatoire->getClientOriginalName(), 'public');
        $validatedData['mode_operatoire'] = $modeOperatoirePath;
    }


                // Storing Photo
                $photo = $request->file('photo');
                // Deleting Old Photo and Inserting The New Photo
                if ($request->hasFile('photo')) {
                    if (!empty($equipement->photo))
                    Storage::disk('public')->delete($equipement->photo);
                    $photoPath = $photo->storeAs('equipements', time() . '_' . $photo->getClientOriginalName(), 'public');
                    $validatedData['photo'] = $photoPath;
                }
                $equipement->update($validatedData);
                return response()->json(['message' => 'Équipement modifié avec succès', 'equipement' => $equipement], 200);
        // } else {
        //     abort(403, 'Vous n\'avez pas l\'autorisation de modifier des équipements.');
        // }
    }

    public function destroy($id)
    {
        // if (Gate::allows('delete_equipements')) {
                $equipement = Equipement::findOrFail($id);
                $photo = $equipement->photo;
                if (!empty($equipement->photo))
                    Storage::disk('public')->delete($equipement->photo);

                if ($equipement->fiche_technique) {
                    if (!empty($equipement->fiche_technique))
                    Storage::disk('public')->delete($equipement->fiche_technique);
                }
                $equipement->delete();

                return response()->json(['message' => 'Équipement supprimé avec succès'], 200);

        // } else {
        //     abort(403, 'Vous n\'avez pas l\'autorisation de supprimer cet équipement.');
        // }
    }
}

