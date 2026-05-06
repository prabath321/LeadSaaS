<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();

            $table->foreignId('company_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('pipeline_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('first_name');
            $table->string('last_name')->nullable();

            $table->string('email')->nullable();
            $table->string('phone')->nullable();

            $table->string('job_title')->nullable();

            $table->string('status')->default('new');
            /*
                new
                contacted
                qualified
                proposal
                won
                lost
            */

            $table->decimal('value', 10, 2)->nullable();

            $table->text('notes')->nullable();

            $table->timestamp('follow_up_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
