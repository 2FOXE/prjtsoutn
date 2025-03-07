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
        // Validate that clients is an array
        $request->validate([
            'clients' => 'required|array',
            'clients.*.cin' => 'required|string',
            'clients.*.nom' => 'required|string',
            'clients.*.prenom' => 'required|string',
            'clients.*.email' => 'required|email',
        ]);
    
        // Ensure clients is an array to avoid null errors
        $clients = $request->input('clients', []);
        dd($request->all());

        foreach ($clients as $client) {
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

