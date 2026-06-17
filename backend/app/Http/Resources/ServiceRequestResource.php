<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceRequestResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'type' => $this->type,
            'scope' => $this->scope,
            'fromCity' => $this->from_city,
            'toCity' => $this->to_city,
            'cargoType' => $this->cargo_type,
            'customsKind' => $this->customs_kind,
            'shippingKind' => $this->shipping_kind,
            'name' => $this->name,
            'mobile' => $this->mobile,
            'notes' => $this->notes ?? '',
            'userId' => $this->user_id ? (string) $this->user_id : null,
            'createdAt' => optional($this->created_at)->toISOString(),
        ];
    }
}
