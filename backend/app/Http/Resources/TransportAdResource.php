<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransportAdResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'category' => 'transport',
            'fromCity' => $this->from_city,
            'toCity' => $this->to_city,
            'cargoType' => $this->cargo_type,
            'weight' => $this->weight ?? '',
            'weightWithTrailer' => $this->weight_with_trailer ?? '',
            'phone' => $this->phone,
            'description' => $this->description ?? '',
            'userId' => $this->user_id ? (string) $this->user_id : null,
            'createdAt' => optional($this->created_at)->toISOString(),
        ];
    }
}
