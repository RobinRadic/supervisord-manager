<script lang="ts" setup>
import { createHighlighter } from 'shiki';

const emit  = defineEmits([ 'close' ]);
const props = defineProps({
    open: { type: Boolean, default: false },
    code: { type: String, required: true },
    language: { type: String, required: true },
});

const show        = toRef(props, 'open');
const highlighted = ref(null);

createHighlighter({
    themes: [ 'one-dark-pro' ],
    langs: [ 'javascript', 'json', 'ini' ],
}).then(highlighter => {
    highlighted.value = highlighter.codeToHtml(props.code, {
        lang: 'ini',
        theme: 'one-dark-pro',
    });
});
const close = () => {
    emit('close');
    show.value = false;
};
</script>

<template>
    <v-dialog v-model="show" max-width="1540">
        <v-card color="#282c34">
            <v-card-text>
            <div v-if="highlighted" style="overflow:auto" v-html="highlighted"/>
            </v-card-text>
            <v-card-actions>
                <v-btn color="success" variant="flat" @click="close">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
