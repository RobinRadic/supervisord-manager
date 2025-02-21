<script lang="ts" setup>
// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-ini';

import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import 'prismjs/themes/prism-tomorrow.css';

const content = defineModel<string>();

const highlighter = (code) => highlight(code, languages.ini, 'ini');

</script>
<template>
    <PrismEditor  class="my-editor" v-model="content" :highlight="highlighter"/>
</template>

<style>
/* required class */
.my-editor {
    height: 100vh;

    /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
    background  : #2D2D2D;
    color       : #CCCCCC;

    /* you must provide font-family font-size line-height. Example: */
    font-family : Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size   : 14px;
    line-height : 1.5;
    padding     : 5px;

    .prism-editor__container {
        .prism-editor__textarea {
            height: 100vh;
            &:focus {
                outline : none;
            }
        }
        .prism-editor__editor {
            height: 100vh;
        }
    }
}

/* optional class for removing the outline */
.prism-editor__textarea{
}
</style>
