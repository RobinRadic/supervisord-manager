<script lang="ts" setup>
import { VBtn } from 'vuetify/components';
import useAppBarComponents from '../../composables/useAppBarComponents.js';
import Editor from '../Editor.vue';

const content  = ref('');
const filename = ref('');
const emit     = defineEmits<{
    back: []
}>();

const onSave = (content: string) => {

};
const bar    = useAppBarComponents();
bar.clearComponents();
bar.add(VBtn, { color: 'success', onClick: () => onSave(content.value), variant: 'flat', size: 'x-large', text: 'Save', prependIcon: 'mdi-content-save' });

</script>

<template>
    <v-card class="mx-auto" width="100%" height="100%">
        <v-text-field v-model="filename" label="Filename" suffix=".conf"/>
        <Editor v-model="content" />
    </v-card>
</template>
