<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LeadResource;
use App\Models\Lead;
use App\Models\Pipeline;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leads = Lead::with(['company', 'pipeline'])
            ->latest()
            ->paginate();

        return LeadResource::collection($leads);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => ['required', Rule::exists('companies', 'id')],
            'pipeline_id' => ['required', Rule::exists('pipelines', 'id')],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', Rule::in(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'])],
            'value' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'follow_up_at' => ['nullable', 'date'],
        ]);

        $this->ensurePipelineBelongsToCompany($validated['pipeline_id'], $validated['company_id']);

        $lead = Lead::create($validated);

        return (new LeadResource($lead->load(['company', 'pipeline'])))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Lead $lead)
    {
        return new LeadResource($lead->load(['company', 'pipeline']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'company_id' => ['sometimes', 'required', Rule::exists('companies', 'id')],
            'pipeline_id' => ['sometimes', 'required', Rule::exists('pipelines', 'id')],
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', Rule::in(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'])],
            'value' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'follow_up_at' => ['nullable', 'date'],
        ]);

        $companyId = $validated['company_id'] ?? $lead->company_id;
        $pipelineId = $validated['pipeline_id'] ?? $lead->pipeline_id;

        $this->ensurePipelineBelongsToCompany($pipelineId, $companyId);

        $lead->update($validated);

        return new LeadResource($lead->load(['company', 'pipeline']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lead $lead)
    {
        $lead->delete();

        return response()->noContent();
    }

    private function ensurePipelineBelongsToCompany(int $pipelineId, int $companyId): void
    {
        $exists = Pipeline::whereKey($pipelineId)
            ->where('company_id', $companyId)
            ->exists();

        if (! $exists) {
            throw ValidationException::withMessages([
                'pipeline_id' => ['The selected pipeline does not belong to the selected company.'],
            ]);
        }
    }
}
