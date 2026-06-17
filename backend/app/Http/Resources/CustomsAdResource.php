<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomsAdResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'category' => 'customs',
            'portName' => $this->port_name,
            'arrivalDate' => optional($this->arrival_date)->format('Y-m-d') ?? '',
            'containersCount' => $this->containers_count ?? '',
            'shipmentType' => $this->shipment_type ?? '',
            'blNumber' => $this->bl_number ?? '',
            'phone' => $this->phone,
            'notes' => $this->notes ?? '',
            'userId' => $this->user_id ? (string) $this->user_id : null,
            'createdAt' => optional($this->created_at)->toISOString(),
        ];
    }
}
