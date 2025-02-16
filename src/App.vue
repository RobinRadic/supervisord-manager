<template>
    <v-app v-if="loaded" class="app-centered">
        <router-view/>
    </v-app>
</template>

<script lang="ts" setup>
import { useSupervisor } from '@/plugins/supervisor/index.js';

const supervisor = useSupervisor();
const loaded     = ref(false);

Promise.all([
    supervisor.updateConfig(),
    supervisor.updateState(),
]).then(() => {
    loaded.value = true;
});

setInterval(() => {
    supervisor.updateState();
}, 5000);
</script>

<style lang="scss">
.app-centered {
    max-width: 2000px;
    margin: 0 auto;
}
</style>
