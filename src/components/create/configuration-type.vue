<template>
    <v-card class="mx-auto" width="400">
        <v-toolbar color="accent">
            <v-icon icon="mdi-plus" style="margin-left:10px" />
            <v-toolbar-title>Create a new configuration</v-toolbar-title>
        </v-toolbar>
        <v-divider/>
        <v-list @update:selected="selected" lines="three">
            <v-list-item
                v-for="item in creationTypes"
                :key="item.value"
                :subtitle="item.subtitle"
                :title="item.title"
                :value="item.value"
                :prepend-icon="item.prependIcon"
            >
                <template #prepend>
                    <v-list-item-action start>
                        <v-icon :icon="item.icon" size="large" style="align-items: baseline; justify-content: unset; margin:7px 10px 0 10px;" />
                    </v-list-item-action>
                </template>
            </v-list-item>
        </v-list>
    </v-card>

</template>

<script lang="ts" setup>
import { VIcon } from 'vuetify/components';
import  {icon,type MdiIconName } from '@/types/icons.js';

const model = defineModel({
    type:String
})
defineProps<{

}>()

const emits = defineEmits<{
    selected: [type:string]
}>();
const selected = (value:string) => {
    model.value = value[0];
    emits('selected', value[0]);
}
// const icon = (icon:MdiIconName) => h(VIcon, { icon, size: 'large', style: {alignItems:'baseline', justifyContent:'flex-start'} })
const creationType  = ref<string>('');
const creationTypes = ref(<Array<{ [ key: string ]: any, prependIcon?: MdiIconName }>>[
    { value: 'template', title: 'Template', subtitle: 'Create a configuration from a template', icon: icon('mdi-file-document-multiple-outline') },
    { value: 'link', title: 'Link', subtitle: 'Create a symlink to an existing configuration somewhere else on the filesystem', icon: icon('mdi-link-variant') },
    { value: 'blank', title: 'Blank', subtitle: 'Create a empty configuration', icon: icon('mdi-file-document-outline') },
    { value: 'upload', title: 'Upload', subtitle: 'Upload a configuration from your pc', icon: icon('mdi-file-upload-outline') },
]);

</script>
