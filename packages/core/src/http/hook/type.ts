/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { TokenCreator, TokenCreatorCreatedHook, TokenCreatorOptions } from '../token-creator';

export type TokenHookOptions = {
    /**
     * The URL of the api service.
     *
     * default: client.baseURL
     */
    baseURL?: string,
    /**
     * Whether to set a timer to refresh the access token?
     *
     * default: true
     */
    timer?: boolean,
    /**
     * Fn to create a new token, if the previous token expired.
     */
    tokenCreator: TokenCreatorOptions | TokenCreator,
    /**
     * Called when the token creator created a new token.
     */
    tokenCreated?: TokenCreatorCreatedHook
};
