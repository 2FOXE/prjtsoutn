<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Support\Facades\Log;
use App\Models\Chambre;
use App\Models\Client;
use App\Models\ClientParticulier;
use Illuminate\Http\Request;
use Illuminate\Support\Str;


class ReservationController extends Controller
{
    public function getAll()
    {
        try {
            $reservations = Reservation::with(['chambres'])->get();
    
            $transformedReservations = $reservations->map(function ($reservation) {
                // Get client data based on client_type
                $client = $reservation->client_type === 'societe' 
                    ? Client::find($reservation->client_id)
                    : ClientParticulier::find($reservation->client_id);
    
                return [
                    'id' => $reservation->id,
                    'reservation_num' => $reservation->reservation_num,
                    'client_id' => $reservation->client_id,
                    'client_type' => $reservation->client_type,
                    'client_name' => $client ? ($reservation->client_type === 'societe' ? $client->raison_sociale : $client->name) : 'Unknown',
                    'reservation_date' => $reservation->reservation_date,
                    'date_debut' => $reservation->date_debut,
                    'date_fin' => $reservation->date_fin,
                    'status' => $reservation->status,
                    'nombre_chambres' => $reservation->chambres->count(),
                    'chambres' => $reservation->chambres->map(function ($chambre) {
                        return [
                            'id' => $chambre->id,
                            'num_chambre' => $chambre->num_chambre,
                            'type_chambre' => $chambre->type_chambre,
                            'etage' => $chambre->etage,
                            'vue' => $chambre->vue
                        ];
                    })
                ];
            });
    
            return response()->json([
                'status' => 'success',
                'reservations' => $transformedReservations
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching reservations: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error fetching reservations',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function ajouterReservation(Request $request)
    {
        $validatedData = $request->validate([
            'client_id' => 'required|integer',
            'client_type' => 'required|in:societe,particulier',
            'chambre_ids' => 'required|array',
            'chambre_ids.*' => 'integer|exists:chambres,id',
            'reservation_date' => 'required|date',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'status' => 'required|in:en attente, confirmé, annulé',
        ]);        
        if ($validatedData['client_type'] === 'societe') {
            $client = Client::find($validatedData['client_id']);
        } else {
            $client = ClientParticulier::find($validatedData['client_id']);
        }
        if (!$client) {
            return response()->json(['error' => 'Client not found'], 404);
        }

        /*$chambre = Chambre::with('tarifChambreDetail')->findOrFail($validatedData['chambre_id']);

        // Compute number of nights and calculate total cost using tariff details
        $nights = (strtotime($validatedData['date_fin']) - strtotime($validatedData['date_debut'])) / (60 * 60 * 24);
        $rate = $chambre->tarifChambreDetail ? $chambre->tarifChambreDetail->single : 0;
        $totalTarif = $rate * $nights;
        $validatedData['montant_total'] = $totalTarif;*/

        $reservationNum = isset($validatedData['reservation_num']) ? $validatedData['reservation_num'] : 'R' . strtoupper(Str::random(6));
        try {
            // Create reservation
            $reservation = Reservation::create([
                'reservation_num' => $reservationNum,
                'client_id' => $validatedData['client_id'],
                'client_type' => $validatedData['client_type'],
                'reservation_date' => $validatedData['reservation_date'],
                'date_debut' => $validatedData['date_debut'],
                'date_fin' => $validatedData['date_fin'],
                'status' => $validatedData['status'],
            ]);
    
            foreach ($validatedData['chambre_ids'] as $chambre_id) {
                $reservation->chambres()->attach($chambre_id);
            }
    
            return response()->json($reservation, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error creating reservation',
                'message' => $e->getMessage()
            ], 500);
        }    }

    public function afficherReservation($id)
    {
        $reservation = Reservation::with('chambre')->findOrFail($id);
        return response()->json($reservation);
    }

    public function updateReservation(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        $validatedData = $request->validate([
            'reservation_num' => 'required|unique:reservations,reservation_num,' . $reservation->id,
            'client_id'          => 'required|integer',
            'client_type'        => 'required|in:societe,particulier',
            'chambre_id'         => 'required|integer|exists:chambres,id',
            'reservation_date'   => 'required|date',
            'date_debut'         => 'required|date',
            'date_fin'           => 'required|date|after_or_equal:date_debut',
            'status'             => 'required|in:pending,confirmed,cancelled'
        ]);

        if ($validatedData['client_type'] === 'societe') {
            $client = Client::find($validatedData['client_id']);
        } else {
            $client = ClientParticulier::find($validatedData['client_id']);
        }
        if (!$client) {
            return response()->json(['error' => 'Client not found'], 404);
        }

        // Retrieve chambre and recalc total cost.
        /*$chambre = Chambre::with('tarifChambreDetail')->findOrFail($validatedData['chambre_id']);
        $nights = (strtotime($validatedData['date_fin']) - strtotime($validatedData['date_debut'])) / (60 * 60 * 24);
        $rate = $chambre->tarifChambreDetail ? $chambre->tarifChambreDetail->single : 0;
        $validatedData['montant_total'] = $rate * $nights;

        $reservation->update($validatedData);
        return response()->json($reservation);*/
    }

    public function supprimerReservation($reservation_num)
    {
        try {
            $reservation = Reservation::where('reservation_num', $reservation_num)->first();
            
            if (!$reservation) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Reservation not found'
                ], 404);
            }
    
            $reservation->chambres()->detach();
            $reservation->delete();
    
            return response()->json([
                'status' => 'success',
                'message' => 'Reservation deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting reservation: ' . $e->getMessage()
            ], 500);
        }
    }
    public function getAvailableRooms(Request $request)
    {
        // Validate incoming request data
        $validatedData = $request->validate([
            'date_debut' => 'required|date',
            'date_fin'   => 'required|date|after_or_equal:date_debut',
        ]);
    
        Log::info("Fetching available rooms for dates:", $validatedData);
    
        try {
            // Get available rooms that are not booked in the date range
            $availableRooms = Chambre::with(['type_chambre', 'vue', 'etage'])
                ->whereDoesntHave('reservations', function ($query) use ($validatedData) {
                    $query->where(function ($query) use ($validatedData) {
                        $query->where('date_debut', '<', $validatedData['date_fin'])
                              ->where('date_fin', '>', $validatedData['date_debut'])
                              ->where('status', '!=', 'annulé'); // Exclude cancelled reservations
                    });
                })
                ->get();
    
            Log::info("Available rooms count:", ['count' => $availableRooms->count()]);
    
            $availableRooms->each(function ($room) {
                Log::info("Room details:", [
                    'room_id' => $room->id,
                    'type_chambre' => $room->type_chambre ? $room->type_chambre->commentaire : 'No Type',
                    'vue' => $room->vue ? $room->vue->vue : 'No Vue',
                    'etage' => $room->etage ? $room->etage->etage : 'No Etage'
                ]);
            });
    
            // Map rooms to return the necessary details
            $roomsWithNames = $availableRooms->map(function ($room) {
                return [
                    'id' => $room->id,
                    'num_chambre' => $room->num_chambre,
                    'type_chambre' => $room->type_chambre ? $room->type_chambre->commentaire : 'Unknown', 
                    'vue' => $room->vue ? $room->vue->vue : 'Unknown', 
                    'etage' => $room->etage ? $room->etage->etage : 'Unknown', 
                ];
            });
    
            return response()->json([
                'rooms' => $roomsWithNames, 
                'count' => $availableRooms->count(),
            ]);
    
        } catch (\Exception $e) {
            Log::error("Error fetching available rooms: " . $e->getMessage(), [
                'stack' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Error fetching available rooms'], 500);
        }
    }
    
}