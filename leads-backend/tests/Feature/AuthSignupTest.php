<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthSignupTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_signup_and_receive_a_token(): void
    {
        $response = $this->postJson('/api/signup', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email'],
                'token',
                'token_type',
            ])
            ->assertJsonPath('user.name', 'Test User')
            ->assertJsonPath('user.email', 'test@example.com')
            ->assertJsonPath('token_type', 'Bearer');

        $user = User::where('email', 'test@example.com')->firstOrFail();

        $this->assertTrue(Hash::check('password123', $user->password));
    }

    public function test_signup_requires_a_unique_email(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $response = $this->postJson('/api/signup', [
            'name' => 'Another User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }
}
