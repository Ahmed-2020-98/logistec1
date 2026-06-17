<?php

use App\Http\Controllers\Api\AdController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Admin\BannerController;
use App\Http\Controllers\Api\Admin\CargoTypeController;
use App\Http\Controllers\Api\Admin\QuickLinkController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MeController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\ServiceRequestController;
use Illuminate\Support\Facades\Route;

$categories = ['transport', 'customs', 'sale'];

// ---- Health / index (GET /api) ----
Route::get('/', fn () => response()->json([
    'name' => 'Gulf Logistics API',
    'status' => 'ok',
    'message' => 'API is running. Use the documented endpoints, e.g. /api/banners, /api/auth/login.',
]));

// ---- Auth ----
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('request-otp', [AuthController::class, 'requestOtp']);
    Route::post('verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::put('password', [AuthController::class, 'changePassword']);
    });
});

// ---- Public ----
Route::get('banners', [PublicController::class, 'banners']);
Route::get('quick-links', [PublicController::class, 'quickLinks']);
Route::get('cargo-types', [PublicController::class, 'cargoTypes']);
Route::get('ads/{category}', [AdController::class, 'index'])->whereIn('category', $categories);

// ---- Authenticated (user) ----
Route::middleware('auth:sanctum')->group(function () use ($categories) {
    Route::get('ads/{category}/{id}', [AdController::class, 'show'])->whereIn('category', $categories)->whereNumber('id');
    Route::post('ads/{category}', [AdController::class, 'store'])->whereIn('category', $categories);
    Route::delete('ads/{category}/{id}', [AdController::class, 'destroy'])->whereIn('category', $categories)->whereNumber('id');

    Route::post('service-requests', [ServiceRequestController::class, 'store']);
    Route::delete('service-requests/{serviceRequest}', [ServiceRequestController::class, 'destroy']);

    Route::get('me/ads', [MeController::class, 'ads']);
    Route::get('me/service-requests', [MeController::class, 'serviceRequests']);
});

// ---- Admin ----
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('stats', [AdminController::class, 'stats']);
    Route::get('service-requests', [AdminController::class, 'serviceRequests']);
    Route::get('ads', [AdminController::class, 'ads']);
    Route::post('reset-demo', [AdminController::class, 'resetDemo']);

    Route::get('users', [UserController::class, 'index']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);

    Route::post('banners', [BannerController::class, 'store']);
    Route::post('banners/{banner}', [BannerController::class, 'update']);
    Route::delete('banners/{banner}', [BannerController::class, 'destroy']);

    Route::post('quick-links', [QuickLinkController::class, 'store']);
    Route::post('quick-links/{quickLink}', [QuickLinkController::class, 'update']);
    Route::delete('quick-links/{quickLink}', [QuickLinkController::class, 'destroy']);

    Route::post('cargo-types', [CargoTypeController::class, 'store']);
    Route::put('cargo-types/{cargoType}', [CargoTypeController::class, 'update']);
    Route::delete('cargo-types/{cargoType}', [CargoTypeController::class, 'destroy']);
});
