<template>

    <v-card
        v-if="isRunning"
        class="mx-auto"
        subtitle="Running"
        title="Server"
    >
        <template v-slot:append>
            <v-icon color="success" icon="mdi-check"></v-icon>
        </template>
        <v-card-text>The server is running. <router-link to="/dashboard">Go to dashboard</router-link>.</v-card-text>
    </v-card>
</template>

<script lang="ts" setup>

import { ProcessState } from '../../shared/ProcessState.js';
import { useBreadcrumbs } from '../composables/useBreadcrumbs.js';
import { type SupervisorData, useSupervisor } from '../plugins/supervisor/index.js';

const {setCurrent} = useBreadcrumbs()

setCurrent('index')
</script>
