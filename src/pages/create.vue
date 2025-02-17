<template>
    <ConfigurationType v-if="!creationType" v-model="creationType"/>
    <LinkCreator v-if="creationType === 'link'" @back="creationType = ''" />
    <BlankCreator v-if="creationType === 'blank'" @back="creationType = ''" />
</template>

<script lang="ts" setup>
import { VIcon } from 'vuetify/components';
import BlankCreator from '../components/create/blank-creator.vue';
import LinkCreator from '../components/create/link-creator.vue';
import { useBreadcrumbs } from '../composables/useBreadcrumbs.js';
import  {icon,type MdiIconName } from '../types/icons.js';
import ConfigurationType from '@/components/create/configuration-type.vue';

const { setCurrent, registerBreadcrumb } = useBreadcrumbs();
registerBreadcrumb('create', { parent: 'configurations', title: 'Create', path: '/create', disabled: true });
setCurrent('create');

// const icon = (icon:MdiIconName) => h(VIcon, { icon, size: 'large', style: {alignItems:'baseline', justifyContent:'flex-start'} })
const creationType  = ref(null);

watchEffect(() => console.log('Creation type changed', creationType.value));
</script>
