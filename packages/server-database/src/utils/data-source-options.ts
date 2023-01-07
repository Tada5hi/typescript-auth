/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */
import { buildDataSourceOptions as build } from 'typeorm-extension';
import path from 'path';
import { DataSourceOptions } from 'typeorm';
import { hasClient, hasConfig } from 'redis-extension';
import { useConfig } from '../config';
import { setEntitiesForDataSourceOptions } from './entities';
import { setSubscribersForDataSourceOptions } from './subscribers';
import { DatabaseQueryResultCache } from '../cache';

export async function buildDataSourceOptions() : Promise<DataSourceOptions> {
    const config = useConfig();

    let dataSourceOptions : DataSourceOptions;

    try {
        dataSourceOptions = await build({
            directory: config.get('rootPath'),
        });
    } catch (e) {
        dataSourceOptions = {
            name: 'default',
            type: 'better-sqlite3',
            database: path.join(
                config.get('writableDirectoryPath'),
                config.get('env') === 'test' ? 'test.sql' : 'db.sql',
            ),
            subscribers: [],
            migrations: [],
        };
    }

    Object.assign(dataSourceOptions, {
        logging: ['error'],
        migrationsTransactionMode: 'each',
    } satisfies Partial<DataSourceOptions>);

    if (hasClient() || hasConfig()) {
        Object.assign(dataSourceOptions, {
            cache: {
                provider(dataSource) {
                    return new DatabaseQueryResultCache();
                },
            },
        } as Partial<DataSourceOptions>);
    }

    return extendDataSourceOptions(dataSourceOptions);
}

export function extendDataSourceOptions(options: DataSourceOptions) {
    options = setEntitiesForDataSourceOptions(options);
    options = setSubscribersForDataSourceOptions(options);

    return options;
}
