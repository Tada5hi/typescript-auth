/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    applyFields,
    applyQuery,
    useDataSource,
} from 'typeorm-extension';
import { NotFoundError } from '@ebec/http';
import { ExpressRequest, ExpressResponse } from '../../../type';
import { RoleEntity } from '../../../../domains';

export async function getManyRoleRouteHandler(req: ExpressRequest, res: ExpressResponse) : Promise<any> {
    const dataSource = await useDataSource();
    const repository = dataSource.getRepository(RoleEntity);
    const query = repository.createQueryBuilder('role');

    const { pagination } = applyQuery(query, req.query, {
        defaultAlias: 'role',
        fields: {
            allowed: [
                'id',
                'name',
                'target',
                'description',
                'realm_id',
                'created_at',
                'updated_at',
            ],
        },
        filters: {
            allowed: ['id', 'name', 'target', 'realm_id'],
        },
        pagination: {
            maxLimit: 50,
        },
        sort: {
            allowed: ['id', 'name', 'updated_at', 'created_at'],
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

export async function getOneRoleRouteHandler(req: ExpressRequest, res: ExpressResponse) : Promise<any> {
    const { id } = req.params;
    const { fields } = req.query;

    const dataSource = await useDataSource();
    const repository = dataSource.getRepository(RoleEntity);
    const query = repository.createQueryBuilder('role')
        .where('role.id = :id', { id });

    applyFields(query, fields, {
        defaultAlias: 'role',
        allowed: [
            'id',
            'name',
            'target',
            'description',
            'realm_id',
            'created_at',
            'updated_at',
        ],
    });

    const entity = await query.getOne();

    if (!entity) {
        throw new NotFoundError();
    }

    return res.respond({ data: entity });
}
