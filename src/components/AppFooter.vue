<script setup lang="ts">
import { VTooltip } from 'vuetify/components';


defineProps<{
    color?: string
}>();
const items = [
    {
        title: 'View source on GitHub',
        icon: `mdi-github`,
        href: 'https://github.com/RobinRadic/supervisord-manager',
    },
];
</script>

<template>
    <v-footer height="40" app :color="color">
        <template v-for="item in items" :key="item.title">
            <VTooltip content-class="bg-primary" location="top" open-on-hover :text="item.title">
                <template #activator="{props}">
                    <a
                        v-bind="props"
                        :href="item.href"
                        :title="item.title"
                        class="d-inline-block mx-2 social-link"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <v-icon
                            :icon="item.icon"
                            :size="item.icon === '$vuetify' ? 24 : 16"
                        />
                    </a>
                </template>
            </VTooltip>
        </template>
        <div
            class="text-caption text-disabled"
            style="position: absolute; right: 16px;"
        >
            &copy; 2016-{{ (new Date()).getFullYear() }} <span class="d-none d-sm-inline-block">Robin Radic</span>
            —
            <a
                class="text-decoration-none on-surface"
                href="https://radic.mit-license.org/"
                rel="noopener noreferrer"
                target="_blank"
            >
                MIT License
            </a>
        </div>
    </v-footer>
</template>


<style scoped lang="sass">
.social-link :deep(.v-icon)
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
    text-decoration: none
    transition: .2s ease-in-out

    &:hover
        color: rgba(25, 118, 210, 1)
</style>
