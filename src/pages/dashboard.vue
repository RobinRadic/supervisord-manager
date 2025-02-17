<template>
    <v-card width="100%" height="100%">
        <Groups compact :groups="supervisor.groups.value"/>
    </v-card>
</template>

<script lang="ts" setup>
import { VBtn } from 'vuetify/components';
import Groups from '../components/Groups.vue';
import useAppBarComponents from '../composables/useAppBarComponents.js';
import { useBreadcrumbs } from '../composables/useBreadcrumbs.js';
import { useSupervisor, useSupervisorActionHandler } from '../plugins/supervisor/index.js';

const supervisor = useSupervisor();

const actions = useSupervisorActionHandler();
const reload  = async () => {
    return actions.reload();
};

const appBar = useAppBarComponents();
appBar.clearComponents();
appBar.add(VBtn, { color: 'success', onClick: reload, variant: 'flat', size: 'x-large', text: 'Reload', border:'s-lg', prependIcon: 'mdi-reload' });
appBar.add(VBtn, { color: 'success', to: '/create', variant: 'flat', size: 'x-large', text: 'Create', border:'s-lg', prependIcon: 'mdi-plus' });

const { setCurrent } = useBreadcrumbs();
setCurrent('dashboard');


</script>
