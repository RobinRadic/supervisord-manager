<script lang="ts" setup>
import { useSupervisor, useSupervisorActionHandler } from '@/plugins/supervisor/index.js';
import { strStripLeft } from '@radicjs/utils';
import dayjs from 'dayjs';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import { groupBy } from 'lodash';
import type { ConfigInfo, ProcessInfo } from 'node-supervisord/dist/interfaces.js';
//@ts-ignore
import type { DataTableHeader } from 'vuetify/dist/vuetify.d.ts';
import { ProcessState } from '../../shared/ProcessState.js';

interface Item extends ConfigInfo {
    process?: ProcessInfo;
}

groupBy()

dayjs.extend(dayjsRelativeTime);
const props              = defineProps<{
    compact: boolean
}>();
const supervisor         = useSupervisor();
const actions            = useSupervisorActionHandler();
const items: Ref<Item[]> = computed(() =>
    supervisor.data.configs.map(config => {
        const process  = supervisor.data.processes.find(process => process.name === config.name && process.group === config.group);
        config.process = process;
        return config;
    }),
);

const headers: DataTableHeader[] = [];

if ( props.compact ) {
    headers.push(
        { title: 'Name', key: 'name' },
        { title: 'Group', key: 'group', align: 'end' },
        { title: 'Actions', key: 'actions', sortable: false },
    );
} else {
    headers.push(
        { title: 'Name', key: 'name' },
        { title: 'Group', key: 'group', align: 'end' },
        { title: 'Command', key: 'command' },
        { title: 'Log', key: 'stdout_logfile', value: (item: ProcessInfo) => dayjs(item.start * 1000).toNow(true) + ' ago' },
        { title: 'Actions', key: 'actions', sortable: false },
    );
}

const handlers              = {
    start: async (name: string) => actions.startProcess(name),
    stop: async (name: string) => actions.stopProcess(name),
    startGroup: async (name: string) => actions.startProcessGroup(name),
    reload: async (name: string) => actions.reload(name),
    edit: (item) => {
        console.log('Edit', item);

        let config = supervisor.data.files.find(f => {
            return Object.keys(f.config).map(key => strStripLeft(key, 'program:')).find(k => k === item.group) !== undefined;
        });
        if ( !config ) {
            console.warn('No config found for item', item);
            return;
        }
    },
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

        <template v-slot:item.name="{ item, value }">
            <template v-if="item.process">
                <v-tooltip location="top" width="600px" content-class="bg-surface">
                    <template #activator="{props}">
                        <span v-bind="props">{{ value }}</span>
                    </template>
                    <template #default>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="4">
                                    State
                                </v-col>
                                <v-col cols="12" sm="8">
                                    <v-chip :color="getStatenameChipColor(item.process.statename)" variant="flat">
                                        {{ item.process.statename }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="4">
                                    Description
                                </v-col>
                                <v-col cols="12" sm="8">
                                    <span>{{ item.process.description }}</span>
                                </v-col>
                            </v-row>
                        </v-container>
                    </template>
                </v-tooltip>
            </template>
            <template v-else>
                {{ value }}
            </template>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-btn prepend-icon="mdi-pencil" color="primary" size="small" :to="'/edit/' + item.group">Edit</v-btn>
            <v-btn prepend-icon="mdi-delete" color="error" size="small" @click="() => handlers.delete(item.name)">Delete</v-btn>
            <v-btn v-if="[ProcessState.RUNNING,ProcessState.STARTING].includes(item?.process?.state)" prepend-icon="mdi-play" color="warning" size="small" @click="() => handlers.stop(item.group +':'+item.name)">Stop</v-btn>
            <v-btn v-else prepend-icon="mdi-play" color="success" size="small" @click="() => handlers.start(item.group +':'+item.name)">Start</v-btn>

        </template>
    </v-data-table>

</template>
