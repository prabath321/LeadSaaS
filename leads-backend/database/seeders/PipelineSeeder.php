<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PipelineSeeder extends Seeder
{
    public function run(): void
    {
        $pipelines = [
            [
                'company_id' => 1,
                'name' => 'Sales',
                'color' => '#3B82F6',
                'sort_order' => 1,
                'is_active' => 1,
            ],
            [
                'company_id' => 1,
                'name' => 'Enterprise',
                'color' => '#10B981',
                'sort_order' => 2,
                'is_active' => 1,
            ],
            [
                'company_id' => 2,
                'name' => 'Marketing',
                'color' => '#F59E0B',
                'sort_order' => 1,
                'is_active' => 1,
            ],
            [
                'company_id' => 2,
                'name' => 'Support',
                'color' => '#EF4444',
                'sort_order' => 2,
                'is_active' => 1,
            ],
            [
                'company_id' => 3,
                'name' => 'Recruitment',
                'color' => '#8B5CF6',
                'sort_order' => 1,
                'is_active' => 1,
            ],
        ];

        foreach ($pipelines as $pipeline) {
            DB::table('pipelines')->updateOrInsert(
                [
                    'company_id' => $pipeline['company_id'],
                    'name' => $pipeline['name'],
                ],
                [
                    ...$pipeline,
                    'updated_at' => now(),
                    'created_at' => now(),
                ],
            );
        }
    }
}
