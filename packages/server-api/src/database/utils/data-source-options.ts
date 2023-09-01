/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import type { DataSourceOptions } from 'typeorm';
import { hasClient, hasConfig } from 'redis-extension';
import { adjustFilePath } from 'typeorm-extension';
import { isDatabaseTypeSupported, useConfig } from '../../config';
import { setEntitiesForDataSourceOptions } from './entities';
import { setSubscribersForDataSourceOptions } from './subscribers';
import { DatabaseQueryResultCache } from '../cache';

export async function buildDataSourceOptions() : Promise<DataSourceOptions> {
    const config = useConfig();

    const dataSourceOptions = config.get('db');
    if (!isDatabaseTypeSupported(dataSourceOptions.type)) {
        throw new Error('At the moment only the database types mysql, better-sqlite3 and postgres are supported.');
    }

    const migrations : string[] = [];
    if (process.env.NODE_ENV !== 'test') {
        const migration = await adjustFilePath(
            `src/database/migrations/${dataSourceOptions.type}/*.{ts,js}`,
            config.get('rootPath'),
        );

        migrations.push(migration);
    }

    Object.assign(dataSourceOptions, {
        migrations,
    } as DataSourceOptions);

    return extendDataSourceOptions(dataSourceOptions);
}

export function extendDataSourceOptions(options: DataSourceOptions) {
    Object.assign(options, {
        logging: ['error'],
        migrationsTransactionMode: 'each',
    } satisfies Partial<DataSourceOptions>);

    if (hasClient() || hasConfig()) {
        Object.assign(options, {
            cache: {
                provider() {
                    return new DatabaseQueryResultCache();
                },
                ignoreErrors: true,
            },
        } as Partial<DataSourceOptions>);
    }

    options = setEntitiesForDataSourceOptions(options);
    options = setSubscribersForDataSourceOptions(options);

    return options;
}
