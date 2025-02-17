<script lang="ts" setup>
import { useSupervisor, useSupervisorActionHandler } from '@/plugins/supervisor/index.js';
import { strStripLeft } from '@radicjs/utils';
import dayjs from 'dayjs';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import { groupBy } from 'lodash';
import type { ConfigInfo, ProcessInfo } from 'node-supervisord/dist/interfaces.js';
//@ts-ignore
import type { DataTableHeader } from 'vuetify/dist/vuetify.d.ts';
import type { Group } from '../../shared/api.js';
import { ProcessState } from '../../shared/ProcessState.js';

dayjs.extend(dayjsRelativeTime);
const props              = defineProps<{
    compact?: boolean
    groups:Group[]
}>();
const supervisor         = useSupervisor();
const actions            = useSupervisorActionHandler();
const items: Ref<Group[]> = toRef(props,'groups')

const headers: DataTableHeader[] = [];

if ( props.compact ) {
    headers.push(
        { title: 'Name', key: 'name' },
        { title: 'Actions', key: 'actions', sortable: false },
    );
} else {
    headers.push(
        { title: 'Name', key: 'name' },
        { title: 'Actions', key: 'actions', sortable: false },
    );
}

const handlers              = {
    start: async (name: string) => actions.startProcess(name),
    stop: async (name: string) => actions.stopProcess(name),
    startGroup: async (name: string) => actions.startProcessGroup(name),
    reload: async (name: string) => actions.reload(),
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
    add: async (name) => actions.addProcessGroup(name),
    remove: async (name) => actions.removeProcessGroup(name),
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
    <v-expansion-panels  variant="accordion">
        <v-expansion-panel v-for="(group,igroup) in groups" :key="igroup">
            <v-expansion-panel-title v-slot="{expanded}"
                                     :expand-icon="group.hasProcesses ? 'mdi-chevron-down' : 'none'"
                                     :collapse-icon="group.hasProcesses ? 'mdi-chevron-up' : 'none'"
            >
                <v-row no-gutters>
                    <v-col class="d-flex justify-start" cols="4">
                        {{ group.name }}
                    </v-col>
                    <v-col class="d-flex justify-end" cols="8">
                        <v-btn prepend-icon="mdi-pencil"
                               color="primary"
                               size="small"
                               :to="'/edit/' + group.name"
                        >Edit</v-btn>

                        <v-btn prepend-icon="mdi-delete"
                               color="error"
                               size="small"
                               @click="() => handlers.delete(group.name)"
                        >Delete</v-btn>

                        <template v-if="group.hasProcesses">
                            <v-btn v-if="[ProcessState.RUNNING,ProcessState.STARTING].includes(group?.processes?.[0].state)"
                                   prepend-icon="mdi-stop"
                                   color="warning"
                                   size="small"
                                   @click="() => handlers.stop(group.name)"
                            >Stop</v-btn>
                            <v-btn v-else
                                   prepend-icon="mdi-play"
                                   color="success"
                                   size="small"
                                   @click="() => handlers.start(group.name)"
                            >Start</v-btn>
                            <v-btn prepend-icon="mdi-minus"
                                   color="error"
                                   size="small"
                                   @click="() => handlers.remove(group.name)"
                            >Remove processes</v-btn>
                        </template>
                        <template v-else>
                            <v-btn prepend-icon="mdi-plus"
                                   color="success"
                                   size="small"
                                   @click="() => handlers.add(group.name)"
                            >Add process</v-btn>
                        </template>
                    </v-col>

                </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text v-if="group.hasProcesses">
                <Processes :items="group.processes" />
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

</template>
