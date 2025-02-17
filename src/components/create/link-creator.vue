<template>
    <v-card class="mx-auto" width="400">
        <v-toolbar color="accent">
            <v-icon icon="mdi-link-variant" style="margin-left:10px" />
            <v-toolbar-title>Create a link</v-toolbar-title>
            <v-spacer />
            <v-btn icon="mdi-arrow-left" @click="emit('back')" />
        </v-toolbar>
        <v-divider/>
        <v-form class="pa-3" @submit="onSubmit">
            <v-text-field v-model="sourceFilePath"
                          :disabled="disabled"
                          label="Source file path" />
            <v-text-field v-model="linkFileName"
                          :disabled="disabled"
                          label="Link file name"
                          suffix=".conf" />
            <v-btn
                class="me-4"
                type="submit"
                color="primary"
                :disabled="disabled"
            >
                submit
            </v-btn>

            <v-btn @click="emit('back')" color="warning"
                   :disabled="disabled">
                cancel
            </v-btn>
        </v-form>
    </v-card>
</template>

<script lang="ts" setup>
import { VIcon } from 'vuetify/components';
import { useAlerts } from '../../composables/useAlerts.js';
import { useSupervisor, useSupervisorActionHandler } from '../../plugins/supervisor/index.js';

const emit = defineEmits<{
    back: []
}>()

const sourceFilePath = ref('/home/radic/projects/vuetify/supervisor-rest-server2.conf');
const linkFileName = ref('supervisor2.conf');
const disabled = ref(false);
const supervisor = useSupervisor();
const actions = useSupervisorActionHandler();
const [_,createAlert] = useAlerts();
const router = useRouter();
const onSubmit =async (event:SubmitEvent) => {
    event.preventDefault();
    event.stopPropagation();
    disabled.value = true;
    try {
        const res = await supervisor.link(sourceFilePath.value, linkFileName.value);
        console.log('link', res);
        createAlert('success','Link created', 'The link has been created',4000)
        await actions.reload()
        return router.push('/dashboard');
    } catch (e) {
        createAlert('error','Error',e.response?.data?.error||e.message,4000);
    }
    disabled.value = false;
}
</script>

<style lang="scss">
//@import "../../styles/base";
</style>
