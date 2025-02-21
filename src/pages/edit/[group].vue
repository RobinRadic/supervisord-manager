<script lang="ts" setup>
import { useAlerts } from '@/composables/useAlerts.js';
import useAppBarComponents from '@/composables/useAppBarComponents.js';
import { useLoaderDialog } from '@/composables/useLoaderDialog.js';
import { useSupervisor } from '@/plugins/supervisor/index.js';
import { VBtn } from 'vuetify/components';
import { useBreadcrumbs } from '../../composables/useBreadcrumbs.js';


const router                  = useRouter();
const supervisor              = useSupervisor();
const createLoader            = useLoaderDialog();
const [ alerts, createAlert ] = useAlerts();

const group = router.currentRoute.value.params.group;

const config = supervisor.findConfigForGroup(group);
if ( !config ) throw new Error('No config found for group ' + group);
const content = ref(config.content);

const saveAndGoBack = async () => {
    const destroy = createLoader({ message: 'Saving config...' });
    try {
        await supervisor.saveConfig(group, content.value);
        await supervisor.updateConfig();
    } catch (e) {
        createAlert('error', 'Error', 'Failed to save config: ' + e.message, 4000);
    }
    destroy();
    router.back();
};


const { setCurrent, registerBreadcrumb } = useBreadcrumbs();
registerBreadcrumb('edit', { parent: 'dashboard', title: group, path: `/edit/${group}`, disabled: true });
registerBreadcrumb('edit.group', { parent: 'edit', title: 'Edit', path: `/edit/${group}`, disabled: true });
setCurrent('edit.group', { group });

const { addComponent,add, clearComponents } = useAppBarComponents();
clearComponents()
add('div',{class:'flex-grow-1'})
add(VBtn,{ size: 'x-large', variant: 'flat', color: 'primary', border: 's-lg', text: 'Cancel', onClick: () => router.back(), prependIcon: 'mdi-arrow-left' } )
add(VBtn,{ size: 'x-large', variant: 'flat', color: 'success', border: 's-lg', text: 'Save', onClick: () => saveAndGoBack(), prependIcon: 'mdi-content-save' })

</script>
<template>
    <Editor v-model="content" />
</template>
