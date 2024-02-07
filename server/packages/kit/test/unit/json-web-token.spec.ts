/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import path from 'path';
import type { KeyPairOptions } from '../../src';
import {
    decodeTokenHeader, deleteKeyPair, signToken, verifyToken,
} from '../../src';

describe('src/json-web-token', () => {
    const directory = path.join(__dirname, '..', '..', 'writable');

    it('should sign and decrypt jsonwebtoken', async () => {
        const data = { text: 'secretText' };

        const signedText = await signToken({
            data,
            type: 'rsa',
            keyPair: {
                directory,
            },
        });

        const decoded = await verifyToken(signedText, {
            type: 'rsa',
            keyPair: {
                directory,
            },
        });

        expect(decoded).toBeDefined();
        expect(decoded.text).toEqual(data.text);

        await deleteKeyPair({
            directory,
        });
    });

    it('should sign and decrypt json webtoken with passphrase', async () => {
        const data = { text: 'secretText' };
        const keyPairOptions : Partial<KeyPairOptions> = {
            passphrase: 'start123',
            privateName: 'private-passphrase',
            publicName: 'public-passphrase',
            directory,
        };

        const signedText = await signToken({
            data,
            type: 'rsa',
            keyPair: keyPairOptions,
        });

        const decoded = await verifyToken(signedText, {
            type: 'rsa',
            keyPair: keyPairOptions,
        });

        expect(decoded).toBeDefined();
        expect(decoded.text).toEqual(data.text);

        expect(decoded).toHaveProperty('iat');
        expect(decoded).toHaveProperty('exp');

        await deleteKeyPair(keyPairOptions);
    });

    it('should sign and decode header', async () => {
        const data = { text: 'secretText' };

        const signedText = await signToken({
            data,
            type: 'rsa',
            keyPair: {
                directory,
            },
        });

        const header = decodeTokenHeader(signedText);
        expect(header).toBeDefined();
        expect(header.typ).toEqual('JWT');
        expect(header.alg).toEqual('RS256');

        await deleteKeyPair({
            directory,
        });
    });
});
