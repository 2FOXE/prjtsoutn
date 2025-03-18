<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSalleConferenceRequest;
use App\Http\Requests\UpdateSalleConferenceRequest;
use App\Models\SalleConference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SalleConferenceController extends Controller
{
    public function index()
    {
        // j‘utiliser le cache pour opitimiser les requete
        $data=Cache::remember("SalleConference_list",3600,function(){
            return SalleConference::all();
        });
        return  response()->json([
            'message'=>"la liste récupérer avec succés",
            'salles_coneference'=>$data,
        ],200);
        
    }

    

    
    public function store(StoreSalleConferenceRequest $request)
    {
        $validated_data=$request->validated();
        $salle_conference=SalleConference::create($validated_data);
        Cache::forget("SalleConference_list");
        return  response()->json([
            'message'=>"la salle  crèe avec succés",
            'salle_coneference'=>$salle_conference,
        ],201);
    }

    
    public function show(string $id)
    {
        $salle_confe=SalleConference::find($id);

        if (!$salle_confe) {
            return response()->json([
                'message' => "Salle non trouvée"
            ], 404);
        }
        return  response()->json([
            'message'=>"la salle  récupérer avec succés",
            'salle_coneference'=>$salle_confe,
        ],200);

    }

    

    public function update(UpdateSalleConferenceRequest $request, string $id)
    {
        $salle_confe=SalleConference::find($id);
        if (!$salle_confe) {
            return response()->json([
                'message' => "Salle non trouvée"
            ], 404);
        }
        $validated_data=$request->validated();
        $salle_confe->update($validated_data);
        Cache::forget("SalleConference_list");
        return  response()->json([
            'message'=>'salle conference ètè modifier  avec succes',
            'salle_coneference'=>$salle_confe,
        ],200);
        
        
    }
    
    
    public function destroy(string $id)
    {
        $salle_conference=SalleConference::find($id);
        if (!$salle_conference) {
            return response()->json([
                'message' => "Salle non trouvée"
            ], 404);
        }
        $salle_conference->delete();
        Cache::forget("SalleConference_list");
        return  response()->json([
            "message"=>"salle conferenece supprimer avec succès"
        ],200);
    }
}
