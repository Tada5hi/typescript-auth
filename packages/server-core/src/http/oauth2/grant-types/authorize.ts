/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { OAuth2TokenGrantResponse } from '@authup/kit';
import {
    OAuth2AuthorizationCodeChallengeMethod,
    OAuth2SubKind, TokenError,
} from '@authup/kit';
import type { OAuth2AuthorizationCode } from '@authup/core-kit';
import {
    hasOAuth2OpenIDScope,
} from '@authup/core-kit';
import { useRequestBody } from '@routup/basic/body';
import { useRequestQuery } from '@routup/basic/query';
import type { Request } from 'routup';
import { getRequestIP } from 'routup';
import { buildOauth2CodeChallenge } from '../authorize';
import { OAuth2AuthorizationCodeRepository } from '../authorize/repository';
import { AbstractGrant } from './abstract';
import type { Grant } from './type';
import type { OAuth2BearerResponseBuildContext } from '../response';
import { buildOAuth2BearerTokenResponse } from '../response';

export class AuthorizeGrantType extends AbstractGrant implements Grant {
    protected codeRepository : OAuth2AuthorizationCodeRepository;

    constructor() {
        super();
        this.codeRepository = new OAuth2AuthorizationCodeRepository();
    }

    async run(request: Request) : Promise<OAuth2TokenGrantResponse> {
        const authorizationCode = await this.validate(request);

        const {
            payload: accessTokenPayload,
            token: accessToken,
        } = await this.issueAccessToken({
            remoteAddress: getRequestIP(request, { trustProxy: true }),
            sub: authorizationCode.user_id,
            subKind: OAuth2SubKind.USER,
            realmId: authorizationCode.realm_id,
            realmName: authorizationCode.realm_name,
            scope: authorizationCode.scope,
            clientId: authorizationCode.client_id,
        });

        const {
            token: refreshToken,
            payload: refreshTokenPayload,
        } = await this.issueRefreshToken(accessTokenPayload);

        const buildContext : OAuth2BearerResponseBuildContext = {
            accessToken,
            accessTokenPayload,
            refreshToken,
            refreshTokenPayload,
        };

        if (hasOAuth2OpenIDScope(authorizationCode.scope)) {
            buildContext.idToken = authorizationCode.id_token;
        }

        return buildOAuth2BearerTokenResponse(buildContext);
    }

    async validate(request: Request) : Promise<OAuth2AuthorizationCode> {
        const code = this.extractCodeParam(request);

        const entity = await this.codeRepository.get(code);
        if (!entity) {
            throw TokenError.grantInvalid();
        }

        if (entity.redirect_uri) {
            const redirectUri = this.extractRedirectURIParam(request);

            if (!redirectUri || entity.redirect_uri !== redirectUri) {
                throw TokenError.redirectUriMismatch();
            }
        }

        if (entity.code_challenge) {
            const codeVerifier = this.extractParam(request, 'code_verifier');
            if (entity.code_challenge_method === OAuth2AuthorizationCodeChallengeMethod.PLAIN) {
                if (codeVerifier !== entity.code_challenge) {
                    throw TokenError.grantInvalid('PKCE code_verifier mismatch.');
                }
            } else {
                const codeVerifierHash = buildOauth2CodeChallenge(codeVerifier);
                if (codeVerifierHash !== entity.code_challenge) {
                    throw TokenError.grantInvalid('PKCE code_verifier mismatch.');
                }
            }
        }

        return entity;
    }

    protected extractRedirectURIParam(request: Request) : string {
        const redirectUri = this.extractParam(request, 'redirect_uri');
        if (!redirectUri) {
            throw TokenError.redirectUriMismatch();
        }

        return redirectUri;
    }

    protected extractCodeParam(request: Request) : string {
        const code = this.extractParam(request, 'code');
        if (!code) {
            throw TokenError.requestInvalid();
        }

        return code;
    }

    protected extractParam(req: Request, key: string) : string | undefined {
        let value = useRequestBody(req, key);
        if (!value) {
            value = useRequestQuery(req, key);
        }

        if (
            typeof value === 'string' &&
            value.length > 0
        ) {
            return value;
        }

        return undefined;
    }
}
