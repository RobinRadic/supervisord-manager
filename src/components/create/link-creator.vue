<template>
    <v-card class="mx-auto" width="400">
        <v-toolbar color="accent">
            <v-icon icon="mdi-link-variant" style="margin-left:10px" />
            <v-toolbar-title>Create a link</v-toolbar-title>
            <v-spacer />
            <v-btn icon="mdi-arrow-left" @click="emit('back')" />
        </v-toolbar>
        <v-divider/>
        <v-form class="pa-3">
            <v-text-field v-model="sourceFilePath" label="Source file path" />
            <v-text-field v-model="linkFileName" label="Link file name" suffix=".conf" />
            <v-btn
                class="me-4"
                type="submit"
                color="primary"
            >
                submit
            </v-btn>

            <v-btn @click="emit('back')" color="warning">
                cancel
            </v-btn>
        </v-form>
    </v-card>
</template>

<script lang="ts" setup>
import { VIcon } from 'vuetify/components';

const emit = defineEmits<{
    back: []
}>()

const sourceFilePath = ref('');
const linkFileName = ref('');
</script>

<style lang="scss">
//@import "../../styles/base";
</style>
