<?php

namespace App\Http\Resources;

use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'image' => Media::url($this->image) ?? '',
            'title' => $this->title,
            'description' => $this->description ?? '',
            'buttonText' => $this->button_text ?? '',
            'url' => $this->url ?? '',
        ];
    }
}
