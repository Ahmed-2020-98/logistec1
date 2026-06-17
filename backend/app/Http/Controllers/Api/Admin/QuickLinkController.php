<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Concerns\HandlesUploads;
use App\Http\Controllers\Controller;
use App\Http\Resources\QuickLinkResource;
use App\Models\QuickLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuickLinkController extends Controller
{
    use HandlesUploads;

    public function store(Request $request): JsonResponse
    {
        $d = $this->validateData($request);
        $link = QuickLink::create([
            'title' => $d['title'],
            'url' => $d['url'],
            'image' => $this->resolveImage($request, 'image', 'quick-links') ?? '🔗',
        ]);

        return response()->json(['data' => new QuickLinkResource($link)], 201);
    }

    public function update(Request $request, QuickLink $quickLink): JsonResponse
    {
        $d = $this->validateData($request);
        $quickLink->update([
            'title' => $d['title'],
            'url' => $d['url'],
            'image' => $this->resolveImage($request, 'image', 'quick-links', $quickLink->image),
        ]);

        return response()->json(['data' => new QuickLinkResource($quickLink)]);
    }

    public function destroy(QuickLink $quickLink): JsonResponse
    {
        $quickLink->delete();

        return response()->json(['message' => 'تم حذف الرابط']);
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'url' => ['required', 'string'],
            'image' => ['nullable'], // emoji, URL string, or uploaded file
        ]);
    }
}
