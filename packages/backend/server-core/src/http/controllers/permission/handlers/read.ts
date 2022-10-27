/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    applyQuery, useDataSource,
} from 'typeorm-extension';
import { NotFoundError } from '@ebec/http';
import { ExpressRequest, ExpressResponse } from '../../../type';
import { PermissionEntity } from '../../../../domains';

export async function getManyPermissionRouteHandler(req: ExpressRequest, res: ExpressResponse): Promise<any> {
    const dataSource = await useDataSource();
    const repository = dataSource.getRepository(PermissionEntity);
    const query = repository.createQueryBuilder('permission');

    const { pagination } = applyQuery(query, req.query, {
        defaultAlias: 'permission',
        filters: {
            allowed: ['id'],
        },
        pagination: {
            maxLimit: 50,
        },
        sort: {
            allowed: ['id', 'created_at', 'updated_at'],
        },
    });

    const [entities, total] = await query.getManyAndCount();

    return res.respond({
        data: {
            data: entities,
            meta: {
                total,
                ...pagination,
            },
        },
    });
}

export async function getOnePermissionRouteHandler(req: ExpressRequest, res: ExpressResponse): Promise<any> {
    const { id } = req.params;

    const dataSource = await useDataSource();
    const repository = dataSource.getRepository(PermissionEntity);
    const result = await repository.createQueryBuilder('permission')
        .where('id = :id', { id })
        .getOne();

    if (!result) {
        throw new NotFoundError();
    }

    return res.respond({ data: result });
}
