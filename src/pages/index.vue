<template>
  <HelloWorld />
</template>

<script lang="ts" setup>

import { useBreadcrumbs } from '../composables/useBreadcrumbs.js';

const {setCurrent} = useBreadcrumbs()
setCurrent('index')
</script>
