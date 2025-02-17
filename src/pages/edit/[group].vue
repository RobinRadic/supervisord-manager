<script lang="ts" setup>
import { useAlerts } from '@/composables/useAlerts.js';
import useAppBarComponents from '@/composables/useAppBarComponents.js';
import { useLoaderDialog } from '@/composables/useLoaderDialog.js';
import { useSupervisor } from '@/plugins/supervisor/index.js';

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-ini';

import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'
import { VBtn } from 'vuetify/components';
import { useBreadcrumbs } from '../../composables/useBreadcrumbs.js';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles
const highlighter = (code) => highlight(code, languages.ini, 'ini');

const router                  = useRouter();
const supervisor              = useSupervisor();
const createLoader            = useLoaderDialog();
const [ alerts, createAlert ] = useAlerts();

const group = router.currentRoute.value.params.group;

const config = supervisor.findConfigForGroup(group);
if ( !config ) throw new Error('No config found for group ' + group);
const content = ref(config.content);

const { setCurrent, registerBreadcrumb } = useBreadcrumbs();
registerBreadcrumb('edit', { parent: 'dashboard', title: group, path: `/edit/${group}`, disabled: true });
registerBreadcrumb('edit.group', { parent: 'edit', title: 'Edit', path: `/edit/${group}`, disabled: true });
setCurrent('edit.group', { group });

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

const { addComponent, clearComponents } = useAppBarComponents();
addComponent(markRaw({ component: 'div', props: { class: 'flex-grow-1' } }));
addComponent(markRaw({ component: VBtn, props: { size: 'x-large', variant: 'flat', color: 'success', text: 'Save', onClick: () => saveAndGoBack() } }));
addComponent(markRaw({ component: VBtn, props: { size: 'x-large', variant: 'flat', color: 'primary', text: 'Cancel', onClick: () => router.back() } }));

onMounted(() => {

});
onBeforeUnmount(() => {
    clearComponents();
});

</script>
<template>
    <PrismEditor class="my-editor" v-model="content" :highlight="highlighter"/>
</template>

<style>
/* required class */
.my-editor {
    /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
    background: #2d2d2d;
    color: #ccc;

    /* you must provide font-family font-size line-height. Example: */
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
    outline: none;
}
</style>
