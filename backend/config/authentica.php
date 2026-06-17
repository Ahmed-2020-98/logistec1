<?php

return [
    // When false (local/dev), OTPs are generated locally, stored in the `otps`
    // table and written to the log instead of being sent over SMS.
    'enabled' => env('AUTHENTICA_ENABLED', false),

    'base_url' => env('AUTHENTICA_BASE_URL', 'https://api.authentica.sa/api/v2'),
    'api_key' => env('AUTHENTICA_API_KEY', ''),
    'template_id' => env('AUTHENTICA_TEMPLATE_ID', 1),
    'otp_length' => (int) env('AUTHENTICA_OTP_LENGTH', 4),

    // In local env the fallback uses this fixed code for easy testing.
    'dev_code' => '1234',
    'otp_ttl_minutes' => 10,
];
