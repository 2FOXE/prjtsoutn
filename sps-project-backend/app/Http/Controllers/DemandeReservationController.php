<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreDemandeReservationRequest;
use App\Http\Requests\UpdateDemandeReservationRequest;
use App\Models\DemandeReservation;
use Illuminate\Support\Facades\Cache;

class DemandeReservationController extends Controller
{
    public function index()
    {
        $reservation=Cache::remember("demande_reservation",3600,function(){
            return DemandeReservation::with(['chambre'])->get();
        });
        return response()->json([
            'success' => true,
            'data' => $reservation
        ], 200);
    }

   
    public function store(StoreDemandeReservationRequest $request)
    {
        $reservation = DemandeReservation::create($request->all());
        Cache::forget("demande_reservation");
        return response()->json([
            'success' => true,
            'message' => 'Réservation créée avec succès',
            'data' => $reservation
        ], 201);
    }

    public function show($id)
    {
        $reservation = DemandeReservation::find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $reservation
        ], 200);
    }

    public function update(UpdateDemandeReservationRequest $request, $id)
    {
        $reservation = DemandeReservation::find($id);
        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);
        }
        
        $reservation->update($request->all());
        
        Cache::forget("demande_reservation");
        return response()->json([
            'success' => true,
            'message' => 'Réservation mise à jour avec succès',
            'data' => $reservation
        ], 200);
    }

    public function destroy($id)
    {
        $reservation = DemandeReservation::find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);
        }
        Cache::forget("demande_reservation");
        $reservation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Réservation supprimée avec succès'
        ], 200);
    }
}
