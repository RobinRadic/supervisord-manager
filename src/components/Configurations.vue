<script lang="ts" setup>
import { useCodeDialog } from '@/composables/useCodeDialog.js';
import { useSupervisor, useSupervisorActionHandler } from '@/plugins/supervisor/index.js';
import { strStripLeft } from '@radicjs/utils';
import dayjs from 'dayjs';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import type { ConfigInfo, ProcessInfo } from 'node-supervisord/dist/interfaces.js';
import { useTheme } from 'vuetify';
//@ts-ignore
import type { DataTableHeader } from 'vuetify/dist/vuetify.d.ts';
import { ProcessState } from '../../shared/ProcessState.js';

dayjs.extend(dayjsRelativeTime);
const supervisor                 = useSupervisor();
const actions                    = useSupervisorActionHandler();
const items: Ref<ConfigInfo[]>  = toRef(supervisor.data, 'configs');
const headers: DataTableHeader[] = [
    { title: 'Name', key: 'name' },
    { title: 'Group', key: 'group', align: 'end' },
    { title: 'Command', key: 'command' },
    { title: 'Log', key: 'stdout_logfile', value: (item: ProcessInfo) => dayjs(item.start * 1000).toNow(true) + ' ago' },
    { title: 'Actions', key: 'actions', sortable: false },
];
const handlers = {
    start: async (name: string) => actions.startProcess(name),
    stop: async (name: string) => actions.stopProcess(name),
    startGroup: async (name: string) => actions.startProcessGroup(name),
    reload: async (name: string) => actions.reload(name),
    edit: (item) => {
        console.log('Edit', item)

        let config = supervisor.data.files.find(f => {
            return Object.keys(f.config).map(key => strStripLeft(key, 'program:')).find(k => k === item.group) !== undefined
        })
        // useRouter().push('/edit/:configfile',{params: {configfile:config.path}})
        if(!config){
            console.warn('No config found for item' , item)
            return;
        }
        createCodeDialog({
            open:true,
            code: config.content,
            language: 'ini',
        })
    },
    delete: () => console.log('delete'),
    logs: () => console.log('logs'),
};
</script>


<template>

    <v-data-table
        :headers="headers"
        :items="items"
        width="700px"
        item-value="name"
        hover
    >
        <template v-slot:item.actions="{ item }">
            <v-btn prepend-icon="mdi-pencil" color="primary" size="small" :to="'/edit/' + item.group">Edit</v-btn>
            <v-btn prepend-icon="mdi-delete" color="error" size="small" @click="() => handlers.delete(item.name)">Delete</v-btn>

        </template>
    </v-data-table>

</template>
