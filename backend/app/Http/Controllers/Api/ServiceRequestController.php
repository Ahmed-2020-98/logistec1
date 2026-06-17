<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceRequestResource;
use App\Models\ServiceRequest;
use App\Support\Phone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceRequestController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $d = $request->validate([
            'type' => ['required', 'in:transport,customs,shipping'],
            'scope' => ['nullable', 'in:domestic,international'],
            'fromCity' => ['nullable', 'string'],
            'toCity' => ['nullable', 'string'],
            'cargoType' => ['nullable', 'string'],
            'customsKind' => ['nullable', 'in:import,export,transit,vehicles'],
            'shippingKind' => ['nullable', 'string'],
            'name' => ['required', 'string'],
            'mobile' => ['required', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $req = ServiceRequest::create([
            'type' => $d['type'],
            'scope' => $d['scope'] ?? null,
            'from_city' => $d['fromCity'] ?? null,
            'to_city' => $d['toCity'] ?? null,
            'cargo_type' => $d['cargoType'] ?? null,
            'customs_kind' => $d['customsKind'] ?? null,
            'shipping_kind' => $d['shippingKind'] ?? null,
            'name' => $d['name'],
            'mobile' => Phone::normalize($d['mobile']),
            'notes' => $d['notes'] ?? null,
            'user_id' => $request->user()->id,
        ]);

        return response()->json(['data' => new ServiceRequestResource($req)], 201);
    }

    public function destroy(Request $request, ServiceRequest $serviceRequest): JsonResponse
    {
        $user = $request->user();
        if ($serviceRequest->user_id !== $user->id && ! $user->isAdmin()) {
            return response()->json(['message' => 'غير مصرّح'], 403);
        }

        $serviceRequest->delete();

        return response()->json(['message' => 'تم حذف الطلب']);
    }
}
