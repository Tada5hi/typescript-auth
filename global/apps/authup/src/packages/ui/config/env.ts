/*
 * Copyright (c) 2023-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasProcessEnv, readFromProcessEnv, readIntFromProcessEnv } from '@authup/server-core';
import type { UIOptions } from './type';

export function extendUIConfigWithEnv(config: UIOptions) {
    let keys = [
        'UI_PORT',
        'NITRO_UI_PORT',
        'NUXT_UI_PORT',
        'NUXT_PUBLIC_UI_PORT',
        'PORT',
        'NITRO_PORT',
        'NUXT_PORT',
        'NUXT_PUBLIC_PORT',
    ];
    if (hasProcessEnv(keys)) {
        config.port = readIntFromProcessEnv(keys);
    }

    keys = [
        'HOST',
        'NITRO_HOST',
        'NUXT_HOST',
    ];

    if (hasProcessEnv(keys)) {
        config.host = readFromProcessEnv(keys);
    }

    keys = [
        'API_URL',
        'NUXT_API_URL',
        'NUXT_PUBLIC_API_URL',
    ];

    if (hasProcessEnv(keys)) {
        config.apiUrl = readFromProcessEnv(keys);
    }

    keys = [
        'PUBLIC_URL',
        'NUXT_PUBLIC_URL',
        'NUXT_PUBLIC_PUBLIC_URL',
    ];
    if (hasProcessEnv(keys)) {
        config.publicUrl = readFromProcessEnv(keys);
    }
}
