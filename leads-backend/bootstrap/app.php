<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo(fn (Request $request) => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (AuthenticationException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $message = match (true) {
                $request->is('api/leads*') => 'Unauthorized. Please login to access leads.',
                $request->is('api/pipelines*') => 'Unauthorized. Please login to access pipelines.',
                $request->is('api/companies*') => 'Unauthorized. Please login to access companies.',
                default => 'Unauthorized. Please login to continue.',
            };

            return response()->json([
                'message' => $message,
            ], 401);
        });
    })->create();
