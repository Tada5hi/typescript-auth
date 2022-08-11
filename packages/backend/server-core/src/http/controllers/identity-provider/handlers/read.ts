/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    applyFields, applyFilters, applyPagination, applyRelations, applySort,
} from 'typeorm-extension';
import { NotFoundError } from '@typescript-error/http';
import { PermissionID } from '@authelion/common';
import { ExpressRequest, ExpressResponse } from '../../../type';
import { IdentityProviderEntity, IdentityProviderRepository } from '../../../../domains';
import { useDataSource } from '../../../../database';

export async function getManyIdentityProviderRouteHandler(req: ExpressRequest, res: ExpressResponse): Promise<any> {
    const {
        page, filter, fields, include, sort,
    } = req.query;

    const dataSource = await useDataSource();
    const repository = dataSource.getRepository(IdentityProviderEntity);

    const query = repository.createQueryBuilder('provider');

    const relations = applyRelations(query, include, {
        defaultAlias: 'provider',
        allowed: ['realm'],
    });

    applyFilters(query, filter, {
        relations,
        defaultAlias: 'provider',
        allowed: ['realm_id', 'realm.name'],
    });

    applySort(query, sort, {
        allowed: ['id', 'created_at', 'updated_at'],
        defaultAlias: 'provider',
    });

    if (
        req.ability &&
        req.ability.has(PermissionID.REALM_EDIT)
    ) {
        applyFields(
            query,
            fields,
            {
                defaultAlias: 'provider',
                allowed: ['client_secret'],
            },
        );
    }

    const pagination = applyPagination(query, page, { maxLimit: 50 });

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

export async function getOneIdentityProviderRouteHandler(req: ExpressRequest, res: ExpressResponse): Promise<any> {
    const { fields, include } = req.query;
    const { id } = req.params;

    const dataSource = await useDataSource();
    const repository = new IdentityProviderRepository(dataSource);

    const query = repository.createQueryBuilder('provider')
        .where('provider.id = :id', { id });

    applyRelations(query, include, {
        defaultAlias: 'provider',
        allowed: ['realm'],
    });

    if (
        req.ability &&
        req.ability.has(PermissionID.REALM_EDIT)
    ) {
        applyFields(
            query,
            fields,
            {
                defaultAlias: 'provider',
                allowed: ['client_secret'],
            },
        );
    }

    const entity = await query.getOne();

    if (!entity) {
        throw new NotFoundError();
    }

    if (
        req.ability &&
        req.ability.has(PermissionID.REALM_EDIT)
    ) {
        await repository.extendEntity(entity);
    }

    return res.respond({
        data: entity,
    });
}
