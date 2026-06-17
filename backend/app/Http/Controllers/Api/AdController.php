<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomsAdResource;
use App\Http\Resources\SaleAdResource;
use App\Http\Resources\TransportAdResource;
use App\Models\CustomsAd;
use App\Models\SaleAd;
use App\Models\TransportAd;
use App\Support\Phone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdController extends Controller
{
    private const MAP = [
        'transport' => [TransportAd::class, TransportAdResource::class],
        'customs' => [CustomsAd::class, CustomsAdResource::class],
        'sale' => [SaleAd::class, SaleAdResource::class],
    ];

    public function index(Request $request, string $category): JsonResponse
    {
        [$model, $resource] = $this->resolve($category);
        $query = $model::query()->latest();

        if ($category === 'transport') {
            $query->when($request->query('fromCity'), fn ($q, $v) => $q->where('from_city', $v))
                ->when($request->query('toCity'), fn ($q, $v) => $q->where('to_city', $v));
        } elseif ($category === 'customs') {
            $query->when($request->query('portName'), fn ($q, $v) => $q->where('port_name', $v));
        } elseif ($category === 'sale') {
            $query->when($request->query('kind'), fn ($q, $v) => $q->where('kind', $v))
                ->when($request->query('location'), fn ($q, $v) => $q->where('location', $v));
        }

        return response()->json(['data' => $resource::collection($query->get())]);
    }

    public function show(string $category, int $id): JsonResponse
    {
        [$model, $resource] = $this->resolve($category);

        return response()->json(['data' => new $resource($model::findOrFail($id))]);
    }

    public function store(Request $request, string $category): JsonResponse
    {
        [$model, $resource] = $this->resolve($category);
        $userId = $request->user()->id;

        $payload = match ($category) {
            'transport' => $this->transportData($request),
            'customs' => $this->customsData($request),
            'sale' => $this->saleData($request),
        };
        $payload['user_id'] = $userId;

        $ad = $model::create($payload);

        return response()->json(['data' => new $resource($ad)], 201);
    }

    public function destroy(Request $request, string $category, int $id): JsonResponse
    {
        [$model] = $this->resolve($category);
        $ad = $model::findOrFail($id);
        $user = $request->user();

        if ($ad->user_id !== $user->id && ! $user->isAdmin()) {
            return response()->json(['message' => 'غير مصرّح'], 403);
        }

        $ad->delete();

        return response()->json(['message' => 'تم حذف الإعلان']);
    }

    /** @return array{0:class-string,1:class-string} */
    private function resolve(string $category): array
    {
        abort_unless(isset(self::MAP[$category]), 404, 'تصنيف غير معروف');

        return self::MAP[$category];
    }

    private function transportData(Request $request): array
    {
        $d = $request->validate([
            'fromCity' => ['required', 'string'],
            'toCity' => ['required', 'string'],
            'cargoType' => ['required', 'string'],
            'weight' => ['nullable', 'string'],
            'weightWithTrailer' => ['nullable', 'string'],
            'phone' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        return [
            'from_city' => $d['fromCity'],
            'to_city' => $d['toCity'],
            'cargo_type' => $d['cargoType'],
            'weight' => $d['weight'] ?? null,
            'weight_with_trailer' => $d['weightWithTrailer'] ?? null,
            'phone' => Phone::normalize($d['phone']),
            'description' => $d['description'] ?? null,
        ];
    }

    private function customsData(Request $request): array
    {
        $d = $request->validate([
            'portName' => ['required', 'string'],
            'arrivalDate' => ['nullable', 'date'],
            'containersCount' => ['nullable', 'string'],
            'shipmentType' => ['nullable', 'string'],
            'blNumber' => ['nullable', 'string'],
            'phone' => ['required', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        return [
            'port_name' => $d['portName'],
            'arrival_date' => $d['arrivalDate'] ?? null,
            'containers_count' => $d['containersCount'] ?? null,
            'shipment_type' => $d['shipmentType'] ?? null,
            'bl_number' => $d['blNumber'] ?? null,
            'phone' => Phone::normalize($d['phone']),
            'notes' => $d['notes'] ?? null,
        ];
    }

    private function saleData(Request $request): array
    {
        $d = $request->validate([
            'kind' => ['required', 'in:truck,equipment,flatbed'],
            'title' => ['required', 'string'],
            'price' => ['required', 'string'],
            'location' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'phone' => ['required', 'string'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'max:2048'],
        ]);

        $paths = [];
        foreach ($request->file('images', []) as $file) {
            $paths[] = $file->store('sale-ads', 'public');
        }

        return [
            'kind' => $d['kind'],
            'title' => $d['title'],
            'price' => $d['price'],
            'location' => $d['location'],
            'description' => $d['description'] ?? null,
            'phone' => Phone::normalize($d['phone']),
            'images' => $paths,
        ];
    }
}
