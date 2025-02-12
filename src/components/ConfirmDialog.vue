<script lang="ts" setup>
const dialog  = ref(null)

const props = defineProps({
    message: String,
    title:String
});

const emit = defineEmits(['confirm', 'close']);

const isActive = ref(false);

const confirm = () => {
    emit('confirm');
    isActive.value = false;
};

const close = () => {
    emit('close');
    isActive.value = false;
};
</script>
<template>
    <v-dialog max-width="500" ref="dialog" v-model="isActive">
        <v-card>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text>{{ message }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" variant="flat" @click="close">No</v-btn>
                <v-btn color="error" variant="flat" @click="confirm">Yes</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
