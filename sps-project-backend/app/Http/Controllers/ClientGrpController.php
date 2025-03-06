<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClientGrp;

class ClientGrpController extends Controller
{
    public function index()
    {
        try { 
            $clients = Client::all();
            return response()->json($clients);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'clients.*.cin' => 'required|string',
            'clients.*.nom' => 'required|string',
            'clients.*.prenom' => 'required|string',
            'clients.*.email' => 'required|email',
        ]);

        // Insert each client into the clientgrp table
        foreach ($request->clients as $client) {
            Clientgrp::create([
                'cin' => $client['cin'],
                'nom' => $client['nom'],
                'prenom' => $client['prenom'],
                'email' => $client['email'],
            ]);
        }

        return response()->json(['message' => 'Clients added successfully'], 201);
    }
    
    public function getClients(Request $request) {
        try {
            $groupId = $request->query('group_id');
    
            if (!$groupId) {
                return response()->json(['error' => 'group_id is required'], 400);
            }
    
            $clients = ClientGrp::where('group_id', $groupId)->get();
    
            return response()->json($clients);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
}

