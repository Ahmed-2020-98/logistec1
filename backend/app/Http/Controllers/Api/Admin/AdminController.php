<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomsAdResource;
use App\Http\Resources\SaleAdResource;
use App\Http\Resources\ServiceRequestResource;
use App\Http\Resources\TransportAdResource;
use App\Models\CustomsAd;
use App\Models\SaleAd;
use App\Models\ServiceRequest;
use App\Models\TransportAd;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Artisan;

class AdminController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'users' => User::count(),
            'serviceRequests' => ServiceRequest::count(),
            'transportAds' => TransportAd::count(),
            'customsAds' => CustomsAd::count(),
            'saleAds' => SaleAd::count(),
        ]);
    }

    public function serviceRequests(): JsonResponse
    {
        return response()->json([
            'data' => ServiceRequestResource::collection(ServiceRequest::latest()->get()),
        ]);
    }

    public function ads(): JsonResponse
    {
        return response()->json([
            'transport' => TransportAdResource::collection(TransportAd::latest()->get()),
            'customs' => CustomsAdResource::collection(CustomsAd::latest()->get()),
            'sale' => SaleAdResource::collection(SaleAd::latest()->get()),
        ]);
    }

    public function resetDemo(): JsonResponse
    {
        if (app()->environment('production')) {
            return response()->json(['message' => 'غير متاح في بيئة الإنتاج'], 403);
        }

        Artisan::call('migrate:fresh', ['--seed' => true, '--force' => true]);

        return response()->json(['message' => 'تمت إعادة تعيين البيانات التجريبية']);
    }
}
