/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { ForbiddenError, NotFoundError } from '@ebec/http';
import { PermissionName } from '@authup/core-kit';
import type { Request, Response } from 'routup';
import { sendAccepted } from 'routup';
import { useDataSource, validateEntityJoinColumns } from 'typeorm-extension';
import { RoutupContainerAdapter } from '@validup/adapter-routup';
import { RoleAttributeEntity } from '../../../../domains';
import { RoleAttributeRequestValidator } from '../utils';
import {
    RequestHandlerOperation, buildPolicyEvaluationDataByRequest, useRequestEnv, useRequestParamID,
} from '../../../request';

export async function updateRoleAttributeRouteHandler(req: Request, res: Response) : Promise<any> {
    const abilities = useRequestEnv(req, 'abilities');
    const hasAbility = await abilities.has(
        PermissionName.ROLE_UPDATE,
    );
    if (!hasAbility) {
        throw new ForbiddenError();
    }

    const id = useRequestParamID(req);

    const validator = new RoleAttributeRequestValidator();
    const validatorAdapter = new RoutupContainerAdapter(validator);
    const data = await validatorAdapter.run(req, {
        group: RequestHandlerOperation.UPDATE,
    });

    const dataSource = await useDataSource();
    await validateEntityJoinColumns(data, {
        dataSource,
        entityTarget: RoleAttributeEntity,
    });

    const repository = dataSource.getRepository(RoleAttributeEntity);

    let entity = await repository.findOneBy({ id });
    if (!entity) {
        throw new NotFoundError();
    }

    entity = repository.merge(entity, data);

    const canAbility = await abilities.safeCheck(
        PermissionName.ROLE_UPDATE,
        buildPolicyEvaluationDataByRequest(req, {
            attributes: entity,
        }),
    );

    if (!canAbility) {
        throw new ForbiddenError();
    }

    await repository.save(entity);

    return sendAccepted(res, entity);
}
