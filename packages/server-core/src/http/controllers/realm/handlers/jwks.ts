/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { JWKType } from '@authup/kit';
import type { JsonWebKey } from 'node:crypto';
import { createPublicKey } from 'node:crypto';
import type { Request, Response } from 'routup';
import { send } from 'routup';
import { In } from 'typeorm';
import { wrapPublicKeyPem } from '@authup/server-kit';
import { useDataSource } from 'typeorm-extension';
import { KeyEntity } from '../../../../domains';
import { useRequestParamID } from '../../../request';

export async function getRealmJwksRouteHandler(req: Request, res: Response) : Promise<any> {
    const id = useRequestParamID(req);

    const dataSource = await useDataSource();
    const repository = dataSource.getRepository(KeyEntity);

    const entities = await repository.find({
        where: {
            realm_id: id,
            type: In([JWKType.RSA, JWKType.EC]),
        },
        order: {
            priority: 'DESC',
        },
    });

    const keys : JsonWebKey[] = entities.map((entity) => {
        const keyObject = createPublicKey({
            key: wrapPublicKeyPem(entity.encryption_key),
            format: 'pem',
            type: 'pkcs1',
        });

        const jwk = keyObject.export({
            format: 'jwk',
        });

        return { ...jwk, alg: entity.signature_algorithm, kid: entity.id };
    });

    return send(res, {
        keys,
    });
}
