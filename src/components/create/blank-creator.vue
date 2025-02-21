<script lang="ts" setup>
import { strEnsureRight } from '@radicjs/utils';
import { VBtn } from 'vuetify/components';
import useAppBarComponents from '../../composables/useAppBarComponents.js';
import { useSupervisor } from '../../plugins/supervisor/index.js';
import Editor from '../Editor.vue';

const supervisor = useSupervisor();
const router     = useRouter();
const content    = ref('');
const filename   = ref('');
const emit       = defineEmits<{
    back: []
}>();

const onSave = async () => {
    await supervisor.create(strEnsureRight(filename.value,'.conf'), content.value);
    router.push('/dashboard');
};
const bar    = useAppBarComponents();
bar.clearComponents();
bar.add(VBtn, { color: 'success', onClick: () => onSave(), variant: 'flat', size: 'x-large', text: 'Save', prependIcon: 'mdi-content-save' });

</script>

<template>
    <v-card class="mx-auto" width="100%" height="100%">
        <v-text-field v-model="filename" label="Filename" suffix=".conf"/>
        <Editor v-model="content"/>
    </v-card>
</template>
