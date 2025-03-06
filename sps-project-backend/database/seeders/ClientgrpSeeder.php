<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clientgrp;

class ClientgrpSeeder extends Seeder
{
    public function run()
    {
        Clientgrp::create([
            'group_id' => 1,
            'client_name' => 'Alice Johnson',
            'client_email' => 'alice@example.com',
        ]);

        Clientgrp::create([
            'group_id' => 3,
            'client_name' => 'Bob Williams',
            'client_email' => 'bob@example.com',
        ]);

        Clientgrp::create([
            'group_id' => 2,
            'client_name' => 'Charlie Brown',
            'client_email' => 'charlie@example.com',
        ]);
    }
}
