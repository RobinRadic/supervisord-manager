<script lang="ts" setup>
import { useAlerts } from '@/composables/useAlerts.js';

const [ alerts, createAlert ] = useAlerts();

window['createAlert'] = createAlert

</script>

<style lang="scss">
.alerts {
    position  : absolute;
    //top       : 125px;
    bottom       : 50px;
    max-width : 600px;
    right     : 20px;
}
.alert {
    min-width: 350px;
}
.alert-progress {
    margin-top : 10px;
}
</style>
<template>
    <div class="alerts">
        <v-alert
            v-for="(alert,i) in alerts"
            :key="i"
            density="compact"
            :text="alert.message"
            :title="alert.title"
            :type="alert.type"
            class="alert"

            closable
        >
            <template #default>
                <v-progress-linear
                    class="alert-progress"
                    reverse
                    :model-value="alert.progress"
                    :height="3"/>
            </template>
        </v-alert>
    </div>
</template>


