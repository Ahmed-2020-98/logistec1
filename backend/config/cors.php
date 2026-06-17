<?php

return [
    /*
     * Cross-Origin Resource Sharing (CORS) configuration.
     * We use Bearer tokens (no cookies), so credentials are not required.
     * Allowed origins come from FRONTEND_URL (comma-separated for multiple).
     */

    'paths' => ['api/*', 'storage/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', env('FRONTEND_URL', 'http://localhost:3000')),
    ))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
