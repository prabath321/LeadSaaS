<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    //
    protected $fillable = [
        'name',
        'email',
        'phone',
        'website',
        'country',
        'city',
        'address',
        'is_active'
    ];

    public function pipelines()
    {
        return $this->hasMany(Pipeline::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }
}
