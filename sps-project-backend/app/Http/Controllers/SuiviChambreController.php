<?php

namespace App\Http\Controllers;

use App\Models\Chambre;
use Illuminate\Http\Request;

class SuiviChambreController extends Controller
{
    /**
     * Récupérer les chambres disponibles entre deux dates avec des filtres supplémentaires
     */
    public function getAvailableChambres(Request $request)
{
    $startDate = $request->input('start_date');
    $endDate = $request->input('end_date');
    $typeChambreId = $request->input('type_chambre');
    $vueId = $request->input('vue_id');
    $etageId = $request->input('etage_id');

    if (!$startDate || !$endDate) {
        return response()->json(['error' => 'Les dates de début et de fin sont requises'], 400);
    }

    $query = Chambre::with(['type_chambre', 'vue', 'etage'])
        ->whereNotIn('id', function ($query) use ($startDate, $endDate) {
            $query->select('details_reservation.chambre_id')
                  ->from('details_reservation')
                  ->join('reservations', 'reservations.id', '=', 'details_reservation.reservation_id')
                  ->where(function ($subQuery) use ($startDate, $endDate) {
                      $subQuery->whereBetween('reservations.date_debut', [$startDate, $endDate])
                               ->orWhereBetween('reservations.date_fin', [$startDate, $endDate])
                               ->orWhere(function ($subQuery2) use ($startDate, $endDate) {
                                   $subQuery2->where('reservations.date_debut', '<', $startDate)
                                             ->where('reservations.date_fin', '>', $endDate);
                               });
                  });
        });

    if ($typeChambreId) {
        $query->where('type_chambre', $typeChambreId);
    }
    if ($vueId) {
        $query->where('vue_id', $vueId);
    }
    if ($etageId) {
        $query->where('etage_id', $etageId);
    }

    $chambres = $query->get()->map(function ($chambre) {
        return [
            'id' => $chambre->id,
            'num_chambre' => $chambre->num_chambre,
            'type_chambre' => $chambre->typeChambre ? $chambre->type_chambre->type_chambre : 'Inconnu',
            'vue' => $chambre->vue ? $chambre->vue->vue : 'Inconnue',
            'etage' => $chambre->etage ? $chambre->etage->etage : 'Inconnu',
            'nb_lit' => $chambre->nb_lit,
            'nb_salle' => $chambre->nb_salle,
            'climat' => $chambre->climat ? 'Oui' : 'Non',
            'wifi' => $chambre->wifi ? 'Oui' : 'Non',
        ];
    });

    return response()->json($chambres);
}
}
