/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Container } from '@authup/config';
import chalk from 'chalk';
import consola from 'consola';
import process from 'node:process';
import type { CAC } from 'cac';
import { executeCommand } from '../command';
import {
    ServerCommand, createServerCommand, createWebAppStartCommand, logChildProcessOutput,
} from '../packages';

export function buildStartCommand(cac: CAC) {
    cac
        .command('start <service>', 'Start a service.')
        .option('-c, --config [config]', 'Specify a configuration file')
        .action(async (service: string, ctx: Record<string, any>) => {
            const root = process.cwd();
            const container = new Container();
            if (ctx.config) {
                await container.loadFromFilePath(ctx.config);
            } else {
                await container.load();
            }

            let command : string | undefined;

            const [, type, id] = service.match(/([^:/]+)[:/]([^:/]+)/);
            if (
                type === 'server' &&
                id === 'core'
            ) {
                command = createServerCommand(ServerCommand.START);
            }

            if (
                type === 'client' &&
                id === 'web'
            ) {
                command = createWebAppStartCommand();
            }

            if (typeof command === 'undefined') {
                consola.error(`The app ${chalk.red(id)} of group ${chalk.red(type)} can not be started.`);
                return;
            }

            const childProcess = await executeCommand({
                command,
                args: {
                    root,
                },
                env: {
                    CONFIG_FILE: ctx.config, // todo
                },
            });

            logChildProcessOutput(childProcess);
        });
}
