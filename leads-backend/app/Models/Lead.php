<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'company_id',
        'pipeline_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'job_title',
        'status',
        'value',
        'notes',
        'follow_up_at'
    ];

    protected $casts = [
        'follow_up_at' => 'datetime',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function pipeline()
    {
        return $this->belongsTo(Pipeline::class);
    }
}
