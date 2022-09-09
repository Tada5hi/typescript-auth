/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { hasClient, hasConfig } from 'redis-extension';
import { cleanUp } from './utils';
import { runOAuth2CleanerInInterval } from './interval';
import { runOAuth2CleanerByEvent } from './event';

export async function runOAuth2Cleaner() {
    await cleanUp();

    if (hasConfig() || hasClient()) {
        await runOAuth2CleanerByEvent();
    } else {
        await runOAuth2CleanerInInterval();
    }
}
