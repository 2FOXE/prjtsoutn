<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;

class GroupSeeder extends Seeder
{
    public function run()
    {
        Group::create([
            'admin' => 'John Doe',
            'group_number' => 'G123',
            'reservation_date' => '2025-02-10',
            'entry_date' => '2025-02-12',
            'leaving_date' => '2025-02-20',
        ]);

        Group::create([
            'admin' => 'Jane Smith',
            'group_number' => 'G124',
            'reservation_date' => '2025-02-15',
            'entry_date' => '2025-02-18',
            'leaving_date' => '2025-02-25',
        ]);
    }
}
