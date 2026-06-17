<?php

namespace App\Services;

use App\Models\Otp;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AuthenticaService
{
    /**
     * Send an OTP to the phone. Uses the Authentica API when enabled,
     * otherwise generates + stores a code locally and logs it.
     */
    public function sendOtp(string $phone, string $purpose = 'verify'): void
    {
        if (config('authentica.enabled')) {
            $res = $this->authenticaRequest('send-otp', [
                'phone' => $phone,
                'method' => 'sms',
                'template_id' => config('authentica.template_id'),
            ]);
            if (! ($res['success'] ?? false)) {
                Log::warning('Authentica send-otp did not succeed', ['phone' => $phone, 'response' => $res]);
            }

            return;
        }

        $this->generateLocalOtp($phone, $purpose);
    }

    /**
     * Verify an OTP. Returns true on success.
     */
    public function verify(string $phone, string $code, string $purpose = 'verify'): bool
    {
        if (config('authentica.enabled')) {
            $res = $this->authenticaRequest('verify-otp', [
                'phone' => $phone,
                'otp' => $code,
            ]);

            // Authentica's verify-otp returns {"status": true, ...} on success.
            return (bool) ($res['status'] ?? $res['success'] ?? false);
        }

        $otp = Otp::where('phone', $phone)
            ->where('purpose', $purpose)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (! $otp || ! hash_equals($otp->code, trim($code))) {
            return false;
        }

        $otp->update(['used' => true]);

        return true;
    }

    private function generateLocalOtp(string $phone, string $purpose): void
    {
        $code = app()->environment('local')
            ? config('authentica.dev_code')
            : (string) random_int(1000, 9999);

        Otp::create([
            'phone' => $phone,
            'code' => $code,
            'purpose' => $purpose,
            'expires_at' => now()->addMinutes(config('authentica.otp_ttl_minutes')),
            'used' => false,
        ]);

        Log::info("[OTP dev] {$phone} ({$purpose}) = {$code}");
    }

    /**
     * @return array<string, mixed>
     */
    private function authenticaRequest(string $path, array $payload): array
    {
        try {
            $res = Http::withHeaders([
                'X-Authorization' => config('authentica.api_key'),
                'Accept' => 'application/json',
            ])->post(rtrim(config('authentica.base_url'), '/').'/'.$path, $payload);

            return $res->json() ?? [];
        } catch (\Throwable $e) {
            Log::error('Authentica request failed: '.$e->getMessage());

            return [];
        }
    }
}
