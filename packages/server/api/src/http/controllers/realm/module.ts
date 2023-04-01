/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    DBody, DController, DDelete, DGet, DPath, DPost, DRequest, DResponse, DTags,
} from '@routup/decorators';
import type { OAuth2JsonWebKey, OAuth2OpenIDProviderMetadata, Realm } from '@authup/core';
import {
    createRealmRouteHandler,
    deleteRealmRouteHandler,
    getManyRealmRouteHandler,
    getOneRealmRouteHandler,
    getRealmJwksRouteHandler,
    getRealmOpenIdConfigurationRouteHandler,
    updateRealmRouteHandler,
} from './handlers';
import { ForceLoggedInMiddleware } from '../../middleware';

@DTags('realm')
@DController('/realms')
export class RealmController {
    @DGet('', [])
    async getMany(
        @DRequest() req: any,
            @DResponse() res: any,
    ): Promise<Realm[]> {
        return getManyRealmRouteHandler(req, res);
    }

    @DPost('', [ForceLoggedInMiddleware])
    async add(
        @DBody() user: NonNullable<Realm>,
            @DRequest() req: any,
            @DResponse() res: any,
    ) : Promise<Realm> {
        return createRealmRouteHandler(req, res);
    }

    @DGet('/:id', [])
    async get(
        @DPath('id') id: string,
            @DRequest() req: any,
            @DResponse() res: any,
    ): Promise<Realm> {
        return getOneRealmRouteHandler(req, res);
    }

    @DGet('/:id/.well-known/openid-configuration', [])
    async getOpenIdConfiguration(
        @DPath('id') id: string,
            @DRequest() req: any,
            @DResponse() res: any,
    ): Promise<OAuth2OpenIDProviderMetadata> {
        return getRealmOpenIdConfigurationRouteHandler(req, res);
    }

    @DGet('/:id/jwks', [])
    async getCerts(
        @DPath('id') id: string,
            @DRequest() req: any,
            @DResponse() res: any,
    ): Promise<OAuth2JsonWebKey[]> {
        return getRealmJwksRouteHandler(req, res);
    }

    @DPost('/:id', [ForceLoggedInMiddleware])
    async edit(
        @DPath('id') id: string,
            @DBody() user: NonNullable<Realm>,
            @DRequest() req: any,
            @DResponse() res: any,
    ) : Promise<Realm> {
        return updateRealmRouteHandler(req, res);
    }

    @DDelete('/:id', [ForceLoggedInMiddleware])
    async drop(
        @DPath('id') id: string,
            @DRequest() req: any,
            @DResponse() res: any,
    ) : Promise<Realm> {
        return deleteRealmRouteHandler(req, res);
    }
}
