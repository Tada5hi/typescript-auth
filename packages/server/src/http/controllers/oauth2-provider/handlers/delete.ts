/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { getRepository } from 'typeorm';
import { ForbiddenError, NotFoundError } from '@typescript-error/http';
import { OAuth2Provider, PermissionID } from '@typescript-auth/domains';
import { ExpressRequest, ExpressResponse } from '../../../type';
import { OAuth2ProviderEntity } from '../../../../domains';

export async function deleteOauth2ProviderRouteHandler(
    req: ExpressRequest,
    res: ExpressResponse,
) : Promise<any> {
    const { id } = req.params;

    if (!req.ability.hasPermission(PermissionID.PROVIDER_DROP)) {
        throw new ForbiddenError();
    }

    const repository = getRepository(OAuth2ProviderEntity);
    const entity = await repository.findOne(id);

    if (typeof entity === 'undefined') {
        throw new NotFoundError();
    }

    await repository.remove(entity);

    return res.respondDeleted({
        data: entity,
    });
}
