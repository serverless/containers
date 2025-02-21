<?php

use App\Http\Controllers\HealthController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'check']);
Route::get('/', [HealthController::class, 'info']);
