<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeadSeeder extends Seeder
{
    public function run(): void
    {
        $leads = [
            [
                'company_id' => 1,
                'pipeline_id' => 1,
                'first_name' => 'John',
                'last_name' => 'Smith',
                'email' => 'john.smith@example.com',
                'phone' => '+49 111 222 333',
                'job_title' => 'Software Engineer',
                'status' => 'new',
                'value' => 5000,
                'notes' => 'Interested in enterprise package',
                'follow_up_at' => '2026-05-10 10:00:00',
            ],
            [
                'company_id' => 1,
                'pipeline_id' => 2,
                'first_name' => 'Emma',
                'last_name' => 'Johnson',
                'email' => 'emma.johnson@example.com',
                'phone' => '+49 444 555 666',
                'job_title' => 'CTO',
                'status' => 'qualified',
                'value' => 12000,
                'notes' => 'Needs technical demo',
                'follow_up_at' => '2026-05-12 14:00:00',
            ],
            [
                'company_id' => 2,
                'pipeline_id' => 3,
                'first_name' => 'Michael',
                'last_name' => 'Brown',
                'email' => 'michael.brown@example.com',
                'phone' => '+49 777 888 999',
                'job_title' => 'Marketing Manager',
                'status' => 'contacted',
                'value' => 3000,
                'notes' => 'Requested pricing details',
                'follow_up_at' => '2026-05-15 09:30:00',
            ],
        ];

        foreach ($leads as $lead) {
            DB::table('leads')->updateOrInsert(
                ['email' => $lead['email']],
                [
                    ...$lead,
                    'updated_at' => now(),
                    'created_at' => now(),
                ],
            );
        }
    }
}
