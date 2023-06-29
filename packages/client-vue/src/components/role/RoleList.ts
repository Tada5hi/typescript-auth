/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { SlotsType } from 'vue';
import { defineComponent } from 'vue';
import type { Role } from '@authup/core';
import type { DomainListSlotsType } from '../../core/render';
import { createDomainListBuilder, defineDomainListEvents, defineDomainListProps } from '../../core/render';
import { useAPIClient } from '../../core';

export const RoleList = defineComponent({
    name: 'RoleList',
    props: defineDomainListProps<Role>(),
    slots: Object as SlotsType<DomainListSlotsType<Role>>,
    emits: defineDomainListEvents<Role>(),
    setup(props, ctx) {
        const { build } = createDomainListBuilder<Role>({
            props,
            setup: ctx,
            load: (buildInput) => useAPIClient().role.getMany(buildInput),
            defaults: {
                footerPagination: true,

                headerSearch: true,
                headerTitle: {
                    content: 'Roles',
                    icon: 'fa-solid fa-user-group',
                },

                noMore: {
                    content: 'No more roles available...',
                },
            },
        });

        return () => build();
    },
});

export default RoleList;
