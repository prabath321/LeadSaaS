<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
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
            'pipeline_id' => $this->pipeline_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'job_title' => $this->job_title,
            'status' => $this->status,
            'value' => $this->value,
            'notes' => $this->notes,
            'follow_up_at' => $this->follow_up_at,
            'company' => new CompanyResource($this->whenLoaded('company')),
            'pipeline' => new PipelineResource($this->whenLoaded('pipeline')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
