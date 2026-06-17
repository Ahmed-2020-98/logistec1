<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CargoTypeResource;
use App\Models\CargoType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CargoTypeController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $d = $request->validate(['name' => ['required', 'string', 'max:255']]);
        $type = CargoType::create(['name' => $d['name']]);

        return response()->json(['data' => new CargoTypeResource($type)], 201);
    }

    public function update(Request $request, CargoType $cargoType): JsonResponse
    {
        $d = $request->validate(['name' => ['required', 'string', 'max:255']]);
        $cargoType->update(['name' => $d['name']]);

        return response()->json(['data' => new CargoTypeResource($cargoType)]);
    }

    public function destroy(CargoType $cargoType): JsonResponse
    {
        $cargoType->delete();

        return response()->json(['message' => 'تم حذف نوع الحمولة']);
    }
}
