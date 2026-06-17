<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomsAdResource;
use App\Http\Resources\SaleAdResource;
use App\Http\Resources\ServiceRequestResource;
use App\Http\Resources\TransportAdResource;
use App\Models\CustomsAd;
use App\Models\SaleAd;
use App\Models\ServiceRequest;
use App\Models\TransportAd;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeController extends Controller
{
    public function ads(Request $request): JsonResponse
    {
        $id = $request->user()->id;

        return response()->json([
            'transport' => TransportAdResource::collection(TransportAd::where('user_id', $id)->latest()->get()),
            'customs' => CustomsAdResource::collection(CustomsAd::where('user_id', $id)->latest()->get()),
            'sale' => SaleAdResource::collection(SaleAd::where('user_id', $id)->latest()->get()),
        ]);
    }

    public function serviceRequests(Request $request): JsonResponse
    {
        $requests = ServiceRequest::where('user_id', $request->user()->id)->latest()->get();

        return response()->json(['data' => ServiceRequestResource::collection($requests)]);
    }
}
