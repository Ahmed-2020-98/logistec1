<?php

namespace App\Http\Resources;

use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleAdResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'category' => 'sale',
            'kind' => $this->kind,
            'title' => $this->title,
            'price' => (string) $this->price,
            'location' => $this->location,
            'description' => $this->description ?? '',
            'images' => collect($this->images ?? [])->map(fn ($p) => Media::url($p))->all(),
            'phone' => $this->phone,
            'userId' => $this->user_id ? (string) $this->user_id : null,
            'createdAt' => optional($this->created_at)->toISOString(),
        ];
    }
}
