<script lang="ts" setup>
import { useAlerts } from '@/composables/useAlerts.js';
import useAppBarComponents from '@/composables/useAppBarComponents.js';
import { useLoaderDialog } from '@/composables/useLoaderDialog.js';
import { useSupervisor } from '@/plugins/supervisor/index.js';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'; // you can still use type imports as far as I know
import { VBtn } from 'vuetify/components';

const router                  = useRouter();
const supervisor              = useSupervisor();
const createLoader            = useLoaderDialog();
const [ alerts, createAlert ] = useAlerts();

const group = router.currentRoute.value.params.group;

const config    = supervisor.findConfigForGroup(group);
if ( !config ) throw new Error('No config found for group ' + group);
let editorInstance: editor.IStandaloneCodeEditor;

const saveAndGoBack = async () => {
    const destroy = createLoader({ message: 'Saving config...' });
    try {
        await supervisor.saveConfig(group, editorInstance.getValue());
        await supervisor.updateConfig();
    } catch (e) {
        createAlert('error', 'Error', 'Failed to save config: ' + e.message, 4000);
    }
    destroy();
    router.back();
};

const { addComponent, clearComponents } = useAppBarComponents();
addComponent(markRaw({
    component: 'div',
    props: { class: 'flex-grow-1' },
}));
addComponent(markRaw({
    component: VBtn,
    props: { size: 'x-large', variant: 'flat', color: 'success', text: 'Save', onClick: () => saveAndGoBack() },
}));
addComponent(markRaw({
    component: VBtn,
    props: { size: 'x-large', variant: 'flat', color: 'primary', text: 'Cancel', onClick: () => router.back() },
}));

onMounted(() => {
    editorInstance = editor.create(document.getElementById('editor'), {
        value: config.content,
        language: 'ini',
        theme: 'vs-dark',
        automaticLayout: true,
    });
});
onBeforeUnmount(() => {
    clearComponents();
});

</script>
<template>
    <div id="editor" style="height: 100%; width: 100%;"></div>
</template>
