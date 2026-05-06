<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'website' => $this->website,
            'country' => $this->country,
            'city' => $this->city,
            'address' => $this->address,
            'is_active' => $this->is_active,
            'pipelines' => PipelineResource::collection($this->whenLoaded('pipelines')),
            'leads' => LeadResource::collection($this->whenLoaded('leads')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
