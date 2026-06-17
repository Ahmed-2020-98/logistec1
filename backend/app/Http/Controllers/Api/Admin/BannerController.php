<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesUploads;
use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    use HandlesUploads;

    public function store(Request $request): JsonResponse
    {
        $d = $this->validateData($request);
        $banner = Banner::create([
            'title' => $d['title'],
            'description' => $d['description'] ?? null,
            'button_text' => $d['buttonText'] ?? null,
            'url' => $d['url'] ?? null,
            'image' => $this->resolveImage($request, 'image', 'banners'),
        ]);

        return response()->json(['data' => new BannerResource($banner)], 201);
    }

    public function update(Request $request, Banner $banner): JsonResponse
    {
        $d = $this->validateData($request);
        $banner->update([
            'title' => $d['title'],
            'description' => $d['description'] ?? null,
            'button_text' => $d['buttonText'] ?? null,
            'url' => $d['url'] ?? null,
            'image' => $this->resolveImage($request, 'image', 'banners', $banner->image),
        ]);

        return response()->json(['data' => new BannerResource($banner)]);
    }

    public function destroy(Banner $banner): JsonResponse
    {
        $banner->delete();

        return response()->json(['message' => 'تم حذف البانر']);
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'buttonText' => ['nullable', 'string'],
            'url' => ['nullable', 'string'],
            'image' => ['nullable'], // file or URL string
        ]);
    }
}
