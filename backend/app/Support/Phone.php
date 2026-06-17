<?php

namespace App\Support;

class Phone
{
    /**
     * Normalize a Saudi mobile number to +9665XXXXXXXX.
     * Accepts 05XXXXXXXX, 5XXXXXXXX, 9665XXXXXXXX, +9665XXXXXXXX.
     */
    public static function normalize(?string $raw): string
    {
        $digits = preg_replace('/[^\d+]/', '', (string) $raw);
        $digits = ltrim($digits, '+');
        if (str_starts_with($digits, '966')) {
            $digits = substr($digits, 3);
        }
        if (str_starts_with($digits, '0')) {
            $digits = substr($digits, 1);
        }

        return '+966'.$digits;
    }

    public static function isValid(?string $raw): bool
    {
        return (bool) preg_match('/^\+9665\d{8}$/', self::normalize($raw));
    }
}
