<script lang="ts" setup>

import { useAlerts } from '@/composables/useAlerts.js';
import { useLoaderDialog } from '@/composables/useLoaderDialog.js';
import { useSupervisor } from '@/plugins/supervisor/index.js';
import { useRouter } from 'vue-router';
import { VBtn, VCheckboxBtn, VSelect } from 'vuetify/components';
import useAppBarComponents from '../../composables/useAppBarComponents.js';
import { useBreadcrumbs } from '../../composables/useBreadcrumbs.js';

const router                  = useRouter();
const supervisor              = useSupervisor();
const createLoader            = useLoaderDialog();
const [ alerts, createAlert ] = useAlerts();

const group                   = router.currentRoute.value.params.group;

const {setCurrent,registerBreadcrumb} = useBreadcrumbs();
registerBreadcrumb('logs', {parent:'dashboard', title: group, path: `/logs/:group`,disabled:true });
registerBreadcrumb('logs.group', {parent:'logs', title: 'Logs', path: `/logs/:group`,disabled:true });
setCurrent('logs.group',{group});


const appBar = useAppBarComponents();
appBar.clearComponents();
appBar.add(VBtn, { color: 'success', onClick:() => router.back(), variant: 'flat', size: 'x-large', text: 'Back', prependIcon: 'mdi-arrow-left' });


const autoRefresh             = ref(false);
const content                 = ref('');
const refreshInterval = ref(5000); // Default interval 5 seconds
const lastUpdate = ref(0);
let intervalId:any = null
let updateTimerId:any = null;

const fetchData = () => {
    supervisor.readProcessStdoutLog(group, - 3000, 0).then((data) => {
        content.value = data;
        lastUpdate.value = 0; // Reset the last update timer
    });
};

const startAutoRefresh = () => {
    if ( intervalId ) clearInterval(intervalId);
    intervalId = setInterval(fetchData, refreshInterval.value);
};

const stopAutoRefresh = () => {
    if ( intervalId ) clearInterval(intervalId);
    intervalId = null;
};

const startUpdateTimer = () => {
    if (updateTimerId) clearInterval(updateTimerId);
    updateTimerId = setInterval(() => {
        lastUpdate.value++;
    }, 1000);
};

const stopUpdateTimer = () => {
    if (updateTimerId) clearInterval(updateTimerId);
    updateTimerId = null;
};
watch(autoRefresh, (newValue) => {
    if (newValue) {
        startAutoRefresh();
        startUpdateTimer();
    } else {
        stopAutoRefresh();
        stopUpdateTimer();
    }
});

watch(refreshInterval, () => {
    if ( autoRefresh.value ) {
        startAutoRefresh();
    }
});

onMounted(() => {
    fetchData();
    startUpdateTimer();
});

onUnmounted(() => {
    stopAutoRefresh();
    stopUpdateTimer();
});
</script>


<template>
    <v-card width="100%" height="100%">
        <v-toolbar>
            <v-toolbar-title>{{ group }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="log-toolbar-items">
                <span v-if="autoRefresh" class="log-toolbar-item log-toolbar-item-last-update">Last update {{ lastUpdate }} seconds ago</span>
                <v-checkbox-btn class="log-toolbar-item log-toolbar-item-auto-refresh" v-model="autoRefresh" label="Auto refresh"/>
                <v-select
                    class="log-toolbar-item log-toolbar-item-refresh-interval"
                    v-model="refreshInterval"
                    :items="[1000, 5000, 10000, 30000]"
                    label="Refresh Interval (ms)"
                    :disabled="!autoRefresh"
                />
            </v-toolbar-items>
        </v-toolbar>
        <v-card-title>{{ group }}</v-card-title>
        <v-card-text>
            <pre>{{ content }}</pre>
        </v-card-text>
    </v-card>
</template>

<style lang="scss">
.log-toolbar-items {
    margin-right : 20px;
}
.log-toolbar-item {
    &-auto-refresh {
        margin-right : 20px;
        min-width    : 150px
    }
    &-refresh-interval {
        min-width : 200px;
    }
}
.log-toolbar-item-last-update {

    padding: 23px;
    font-size: 0.8rem;
}
</style>
