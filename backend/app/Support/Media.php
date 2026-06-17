<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class Media
{
    /**
     * Resolve a stored value to a public URL. Pass-through for emojis,
     * absolute URLs and data URLs; otherwise build a public-disk URL.
     */
    public static function url(?string $value): ?string
    {
        if (! $value) {
            return $value;
        }
        if (str_starts_with($value, 'http') || str_starts_with($value, 'data:') || ! str_contains($value, '/')) {
            // absolute URL, data URL, or a bare emoji/string — return as-is
            return $value;
        }

        return Storage::disk('public')->url($value);
    }
}
