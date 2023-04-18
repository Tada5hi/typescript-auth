/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { PropType } from 'vue';
import { defineComponent, toRefs } from 'vue';
import type { BuildInput } from 'rapiq';
import type { IdentityProvider } from '@authup/core';
import type { DomainListHeaderSearchOptionsInput, DomainListHeaderTitleOptionsInput } from '../../helpers';
import { createDomainListBuilder } from '../../helpers';
import {
    useAPIClient,
} from '../../core';

export const IdentityProviderList = defineComponent({
    name: 'IdentityProviderList',
    props: {
        loadOnSetup: {
            type: Boolean,
            default: true,
        },
        query: {
            type: Object as PropType<BuildInput<IdentityProvider>>,
            default() {
                return {};
            },
        },
        noMore: {
            type: Boolean,
            default: true,
        },
        footerPagination: {
            type: Boolean,
            default: true,
        },
        headerTitle: {
            type: [Boolean, Object] as PropType<boolean | DomainListHeaderTitleOptionsInput>,
            default: true,
        },
        headerSearch: {
            type: [Boolean, Object] as PropType<boolean | DomainListHeaderSearchOptionsInput>,
            default: true,
        },
    },
    emits: {
        deleted: (item: IdentityProvider) => true,
        updated: (item: IdentityProvider) => true,
    },
    setup(props, ctx) {
        const { build } = createDomainListBuilder<IdentityProvider>({
            props: toRefs(props),
            setup: ctx,
            load: (buildInput) => useAPIClient().identityProvider.getMany(buildInput),
            defaults: {
                footerPagination: true,

                headerSearch: true,
                headerTitle: {
                    content: 'Providers',
                    icon: 'fa-solid fa-atom',
                },
                noMore: {
                    textContent: 'No more identity-providers available...',
                },
            },
        });

        return () => build();
    },
});

export default IdentityProviderList;
