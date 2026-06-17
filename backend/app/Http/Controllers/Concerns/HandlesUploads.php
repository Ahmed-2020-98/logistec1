<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;

trait HandlesUploads
{
    /**
     * Resolve an image field that may arrive as an uploaded file, a URL/emoji
     * string, or be absent (keep the existing value).
     */
    protected function resolveImage(Request $request, string $field, string $folder, ?string $existing = null): ?string
    {
        if ($request->hasFile($field)) {
            return $request->file($field)->store($folder, 'public');
        }

        $value = $request->input($field);
        if (is_string($value) && $value !== '') {
            return $value;
        }

        return $existing;
    }
}
