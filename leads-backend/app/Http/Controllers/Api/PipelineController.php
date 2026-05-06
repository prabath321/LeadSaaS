<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PipelineResource;
use App\Models\Pipeline;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PipelineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pipelines = Pipeline::with('company')
            ->orderBy('sort_order')
            ->latest()
            ->paginate();

        return PipelineResource::collection($pipelines);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => ['required', Rule::exists('companies', 'id')],
            'name' => ['required', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['sometimes', 'integer'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $pipeline = Pipeline::create($validated);

        return (new PipelineResource($pipeline->load('company')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Pipeline $pipeline)
    {
        return new PipelineResource($pipeline->load(['company', 'leads']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pipeline $pipeline)
    {
        $validated = $request->validate([
            'company_id' => ['sometimes', 'required', Rule::exists('companies', 'id')],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['sometimes', 'integer'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $pipeline->update($validated);

        return new PipelineResource($pipeline->load('company'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pipeline $pipeline)
    {
        $pipeline->delete();

        return response()->noContent();
    }
}
