<script lang="ts" setup>
const dialog  = ref(null)
const props = defineProps({
    message: String,
});
const show = ref(true);
</script>
<template>
    <v-dialog
        :ref="dialog"
        v-model="show"
        max-width="320"
        persistent
    >
        <v-list
            class="py-2"
            color="primary"
            elevation="12"
            rounded="lg"
        >
            <v-list-item
                prepend-icon="$vuetify-outline"
                :title="message"
            >
                <template v-slot:prepend>
                    <div class="pe-4">
                        <v-icon color="primary" size="x-large"></v-icon>
                    </div>
                </template>

                <template v-slot:append>
                    <v-progress-circular
                        color="primary"
                        indeterminate="disable-shrink"
                        size="16"
                        width="2"
                    ></v-progress-circular>
                </template>
            </v-list-item>
        </v-list>
    </v-dialog>
</template>
