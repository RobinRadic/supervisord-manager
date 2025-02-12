<template>
    <v-card width="100%" height="100%">
        <v-tabs
            v-model="tab"

            bg-color="primary"
        >
            <v-tab v-for="tab in tabs" :value="tab.name">{{ tab.title }}</v-tab>
            <div class="flex-grow-1"></div>
            <v-btn color="error" variant="flat" size="x-large" @click="handleCreate">Create</v-btn>
        </v-tabs>

        <v-card-text>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item v-for="tab in tabs" :value="tab.name">
                    <component :is="tab.component"/>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import Configurations from '@/components/Configurations.vue';
import Processes from '@/components/Processes.vue';
import { useLoaderDialog } from '@/composables/useLoaderDialog.js';
const createDialog = useLoaderDialog()
const handleCreate = () => {
    const destroy = createDialog({
        message: 'Creating new process...',
    });
    setTimeout(() => {
        destroy();
    }, 2000);
}
const tab  = ref('one');
const tabs = [
    { name: 'processes', title: 'Processes', component: Processes },
    { name: 'configurations', title: 'Configurations', component: Configurations },
];
</script>
