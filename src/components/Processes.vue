<script lang="ts" setup>
import { useSupervisor, useSupervisorActionHandler } from '@/plugins/supervisor/index.js';
import { strStripLeft } from '@radicjs/utils';
import dayjs from 'dayjs';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import type { ProcessInfo } from 'node-supervisord/dist/interfaces.js';
//@ts-ignore
import type { DataTableHeader } from 'vuetify/dist/vuetify.d.ts';
import { ProcessState } from '../../shared/ProcessState.js';

dayjs.extend(dayjsRelativeTime);
const props = defineProps<{
    compact?:boolean
    items:ProcessInfo[]
}>()

const supervisor                 = useSupervisor();
const actions                    = useSupervisorActionHandler();
const items: Ref<ProcessInfo[]>  = toRef(props, 'items');
const headers: DataTableHeader[] = [];

if(props.compact){
    headers.push(
        { title: 'Name', key: 'name' },
        { title: 'State', key: 'statename' },
        { title: 'Description', key: 'description' },
        { title: 'Actions', key: 'actions', sortable: false },
    )
} else {
    headers.push(
        { title: 'Name', key: 'name' },
        { title: 'Group', key: 'group', align: 'end' },
        { title: 'State', key: 'statename' },
        { title: 'Last start', key: 'start', value: (item: ProcessInfo) => dayjs(item.start * 1000).toNow(true) + ' ago' },
        { title: 'Last stop', key: 'stop', value: (item: ProcessInfo) => dayjs(item.stop * 1000).toNow(true) + ' ago' },
        { title: 'Description', key: 'description' },
        { title: 'Actions', key: 'actions', sortable: false },
    )
}


const handlers = {
    start: async (name: string) => actions.startProcess(name),
    stop: async (name: string) => actions.stopProcess(name),
    startGroup: async (name: string) => actions.startProcessGroup(name),
    reload: async (name: string) => actions.reload(name),
    delete: () => console.log('delete'),
    logs: () => console.log('logs'),
};

const getStatenameChipColor = (state: string) => {//@formatter:off
    switch ( state ) {
        case 'FATAL': return 'red';
        case 'RUNNING': return 'green';
        case 'RESTARTING': return 'orange';
        case 'SHUTDOWN': return 'red';
    }
};//@formatter:on


</script>


<template>
    <v-data-table
        :headers="headers"
        :items="items"

        width="700px"
        item-value="name"
        hover
    >
        <template v-slot:item.statename="{ value }">
            <v-chip :color="getStatenameChipColor(value)" variant="flat">
                {{ value }}
            </v-chip>
        </template>
        <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
            <tr>
                <td :colspan="columns.length">
                    <VBtn
                        :icon="isGroupOpen(item) ? '$expand' : '$next'"
                        size="small"
                        variant="text"
                        @click="toggleGroup(item)"
                    ></VBtn>
                    {{ item.value }}
                </td>
            </tr>
        </template>
        <!-- 'primary', 'secondary', 'accent', 'error', 'warning', 'info', 'success'-->
        <template v-slot:item.actions="{ item }">
            <v-btn v-if="[ProcessState.RUNNING,ProcessState.STARTING].includes(item.state)" prepend-icon="mdi-play" color="warning" size="small" @click="() => handlers.stop(item.group +':'+item.name)">Stop</v-btn>
            <v-btn v-else prepend-icon="mdi-play" color="success" size="small" @click="() => handlers.start(item.group +':'+item.name)">Start</v-btn>
            <v-btn prepend-icon="mdi-label" color="info" size="small" :to="'/logs/' + item.group +':'+item.name">Logs</v-btn>
        </template>
    </v-data-table>
</template>
