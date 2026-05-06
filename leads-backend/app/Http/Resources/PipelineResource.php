<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PipelineResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'name' => $this->name,
            'color' => $this->color,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'company' => new CompanyResource($this->whenLoaded('company')),
            'leads' => LeadResource::collection($this->whenLoaded('leads')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
