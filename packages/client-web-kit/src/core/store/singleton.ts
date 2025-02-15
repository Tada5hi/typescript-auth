/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Pinia } from 'pinia';
import type { App } from 'vue';
import { inject } from '../inject';
import { provide } from '../provide';
import type { Store, StoreDefinition } from './types';

const sym = Symbol.for('AuthupStore');

export function injectStore(pinia?: Pinia, app?: App) : Store {
    const instance = injectStoreFactory(app);
    if (!instance) {
        throw new Error('The store has not been injected in the app context.');
    }

    return instance(pinia);
}

export function injectStoreFactory(app?: App) : StoreDefinition {
    const instance = inject<StoreDefinition>(sym, app);
    if (!instance) {
        throw new Error('The store factory has not been injected in the app context.');
    }

    return instance;
}

export function hasStoreFactory(app?: App) : boolean {
    return !!inject(sym, app);
}

export function provideStoreFactory(store: StoreDefinition, app?: App) {
    provide(sym, store, app);
}
