<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            [
                'name' => 'Google',
                'website' => 'https://google.com',
                'email' => 'google@example.com',
                'phone' => '+1 111111111',
            ],
            [
                'name' => 'Microsoft',
                'website' => 'https://microsoft.com',
                'email' => 'microsoft@example.com',
                'phone' => '+1 222222222',
            ],
            [
                'name' => 'OpenAI',
                'website' => 'https://openai.com',
                'email' => 'openai@example.com',
                'phone' => '+1 333333333',
            ],
        ];

        foreach ($companies as $company) {
            DB::table('companies')->updateOrInsert(
                ['email' => $company['email']],
                [
                    ...$company,
                    'updated_at' => now(),
                    'created_at' => now(),
                ],
            );
        }
    }
}
