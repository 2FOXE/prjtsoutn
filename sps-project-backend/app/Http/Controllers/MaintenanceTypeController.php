<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaintenanceType; 

class MaintenanceTypeController extends Controller
{
    public function index()
    {
        // Retrieve maintenance types from the database table "types_maintenance"
        $types = MaintenanceType::all();
        return response()->json(['types' => $types]);
    }
    
    // Add the store method to handle POST requests
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string',
        ]);

        $type = MaintenanceType::create($validated);
        return response()->json(['type' => $type], 201);
    }
}
