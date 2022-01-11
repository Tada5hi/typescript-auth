/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Config } from '../config';
import { DatabaseRootSeederOptions } from '../database';

export type CommandContext = {
    config?: Config,
    databaseConnectionExtend?: boolean,
    databaseSeederOptions?: DatabaseRootSeederOptions
};

export type StartCommandContext = CommandContext;

export type SetupCommandContext = CommandContext & {
    keyPair: boolean,
    database: boolean,
    databaseSeeder: boolean,
    documentation: boolean
};

export type UpgradeCommandContext = CommandContext;

export type ResetCommandContext = CommandContext;

export type CheckCommandContext = CommandContext;
