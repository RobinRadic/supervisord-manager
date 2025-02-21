<route lang="yaml">
meta:
    layout: blank
</route>
<template>
    <div>
        <v-card
            class="mx-auto pa-12 pb-8"
            elevation="8"
            width="448"
            rounded="lg"
        >
            <v-form @submit="onSubmit">
            <div class="text-subtitle-1 text-medium-emphasis">Email</div>

            <v-text-field
                v-model="email"
                density="compact"
                placeholder="Email address"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                :disabled="disabled"
            ></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password
            </div>

            <v-text-field
                v-model="password"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPassword ? 'text' : 'password'"
                density="compact"
                placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                :disabled="disabled"
                @click:append-inner="showPassword = !showPassword"
            ></v-text-field>

            <v-card
                class="mb-12"
                color="surface-variant"
                variant="tonal"
                v-if="error"
            >
                <v-card-text class="bg-error text-medium-emphasis text-caption">
                    Invalid credentials!
                </v-card-text>
            </v-card>

            <v-btn
                class="mb-8"
                color="blue"
                size="large"
                variant="tonal"
                block
                :disabled="disabled"
                type="submit"
            >
                Log In
            </v-btn>
            </v-form>
        </v-card>
    </div>
</template>

<script lang="ts" setup>
import { useAlerts } from '@/composables/useAlerts.js';
import { useSupervisor, useSupervisorActionHandler } from '@/plugins/supervisor/index.js';
import { useStorage } from '@vueuse/core';
import { useAuth } from '../plugins/auth.js';

const emit               = defineEmits<{
    back: []
}>();
//@ts-ignore
const storageEmail       = useStorage('email', '');
const router             = useRouter();
const auth               = useAuth();
const supervisor         = useSupervisor();
const actions            = useSupervisorActionHandler();
const [ _, createAlert ] = useAlerts();

const email        = ref(storageEmail.value);
const password     = ref('');
const showPassword = ref(false);
const disabled     = ref(false);
const error        = ref(false);
const rules        = {
    required: value => !!value || 'Required.',
    min: v => v.length >= 8 || 'Min 8 characters',
    emailMatch: () => (`The email and password you entered don't match`),
};
const onSubmit     = async (event: SubmitEvent) => {
    event.preventDefault();
    event.stopPropagation();
    disabled.value = true;
    error.value    = false;
    try {
        const res = await auth.login(email.value, password.value);
        if ( !res.success ) {
            throw new Error(res.error);
        }
        console.log('link', res);
        storageEmail.value=email.value;
        createAlert('success', 'Logged in', 'You have been logged in ', 4000);
        await supervisor.updateStatus();
        await supervisor.updateConfig();
        return router.push('/');
    } catch (e) {
        error.value = e.response?.data?.error || e.message;
        createAlert('error', 'Error', e.response?.data?.error || e.message, 4000);
    }
    disabled.value = false;
};
</script>
