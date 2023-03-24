/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Robot } from '@authup/common';
import { hasClient, useClient } from '@hapic/vault';

export function hasVaultClient() {
    return hasClient();
}

export async function saveRobotCredentialsToVault(entity: Pick<Robot, 'id' | 'secret' | 'name'>) {
    if (!hasClient()) {
        return;
    }

    const client = useClient();

    await client.keyValue.save('robots', entity.name, {
        id: entity.id,
        secret: entity.secret,
    });
}

export async function removeRobotCredentialsFromVault(entity: Pick<Robot, 'name'>) {
    if (!hasClient()) {
        return;
    }

    const client = useClient();

    await client.keyValue.delete('robots', entity.name);
}

export async function findRobotCredentialsInVault(
    entity: Pick<Robot, 'name'>,
) : Promise<Pick<Robot, 'id' | 'secret'> | undefined> {
    if (!hasClient()) {
        return undefined;
    }

    const client = useClient();

    const response = await client.keyValue.find('robots', entity.name);
    if (response && response.data) {
        return response.data as Robot;
    }

    return undefined;
}
