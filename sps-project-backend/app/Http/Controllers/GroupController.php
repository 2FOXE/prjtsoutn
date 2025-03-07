<?php

namespace App\Http\Controllers;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class GroupController extends Controller
{
    public function index()
    {
        try {
            $groups = Group::all();
            return response()->json($groups);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    
    public function getGroupByNumber($groupNumber) {
        try {
            Log::info("API Request for groupNumber: " . $groupNumber);

            $group = Group::where('groupNumber', $groupNumber)->first();

            if (!$group) {
                Log::error("Group not found for groupNumber: " . $groupNumber);
                return response()->json(["error" => "Group not found"], 404);
            }

            Log::info("Found group: " . json_encode($group));

            return response()->json($group);
        } catch (\Exception $e) {
            Log::error("Error in getGroupByNumber: " . $e->getMessage());
            return response()->json(["error" => "Internal Server Error"], 500);
        }
    }

    public function destroy($groupNumber)
    {
        $group = Group::where('groupNumber', $groupNumber)->first();
    
        if (!$group) {
            return response()->json(['message' => 'Group not found'], 404);
        }
    
        try {
            $group->delete();
            return response()->json(['message' => 'Group deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error deleting group: ' . $e->getMessage()], 500);
        }
    }

}