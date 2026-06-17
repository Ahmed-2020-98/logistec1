<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'fullName' => $this->full_name,
            'phone' => $this->phone,
            'isVerified' => (bool) $this->is_verified,
            'role' => $this->role,
            'createdAt' => optional($this->created_at)->toISOString(),
        ];
    }
}
