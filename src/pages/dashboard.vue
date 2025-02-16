<template>
    <v-card width="100%" height="100%">
        <v-tabs
            v-model="tab"
            @update:modelValue="updateTab"
            bg-color="primary"
        >
            <v-tab v-for="tab in tabs" :value="tab.name">{{ tab.title }}</v-tab>
            <div class="flex-grow-1"></div>
            <v-btn color="success" to="/create" variant="flat" size="x-large">Create</v-btn>
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
import { useBreadcrumbs } from '../composables/useBreadcrumbs.js';

const {setCurrent} = useBreadcrumbs()
setCurrent('dashboard')

const createDialog = useLoaderDialog()
const handleCreate = () => {
    const destroy = createDialog({
        message: 'Creating new process...',
    });
    setTimeout(() => {
        destroy();
    }, 2000);
}
const updateTab = (tab: string,...args) => {
    console.log('Tab changed to', tab, ...args);
    // location.hash = tab;
    history.pushState({tab}, '', `#${tab}`);
    setCurrent(tab);
}
// window.addEventListener('hashchange', () => {
//     tab.value = location.hash.replace('#', '') || 'processes';
// });
const tab  = ref(location.hash.replace('#', '') || 'processes');
setCurrent(tab.value);
const tabs = [
    { name: 'processes', title: 'Processes', component: Processes },
    { name: 'configurations', title: 'Configurations', component: Configurations },
];

const popStateListener = (event: PopStateEvent) => {
    console.log('Pop state', event.state);
    if ( event.state && event.state.tab ) {
        tab.value = event.state.tab;
    }
}
onMounted(() => {
    if ( location.hash.startsWith('#') ) {
        let _tab           = location.hash.slice(1);
        tab.value = _tab;
    }
    let hash = `#${tab.value}`
    if ( location.hash != hash ) {
        location.hash = hash;
    }
    history.pushState({
        tab: tab.value
    }, '', `#${tab.value}`)

    window.addEventListener("popstate", popStateListener);
});

onBeforeUnmount(() => {
    window.removeEventListener('popstate', popStateListener);
});

</script>
