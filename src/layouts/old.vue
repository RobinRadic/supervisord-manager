<template>
    <v-app class="rounded rounded-md">
        <v-system-bar color="grey-darken-3"></v-system-bar>

<!--        <v-navigation-drawer color="grey-darken-2"            width="72"            permanent        ></v-navigation-drawer>-->

        <v-navigation-drawer
            color="grey-darken-1"
            width="256"
            class="r-layout__sidebar"
            v-model="drawer"
            :rail="rail"
            permanent
            @click="rail = false"
        >
            <v-list>
                <v-list-item
                    prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
                    subtitle="john@google.com"
                    title="John Leider"
                >
                    <template v-slot:append>

                        <v-btn
                            icon="mdi-chevron-left"
                            variant="text"
                            @click.stop="rail = !rail"
                        ></v-btn>
                    </template>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list
                :lines="false"
                :items="sidebarItems"
                density="compact"
                class="r-sidebar__list"
                nav
                selectable
            >
                <template #append="props">
<!--                    <v-icon icon="mdi-plus" size="20"></v-icon>-->
                    <v-badge v-if="props.item.badge" v-bind="props.item.badge"/>
                    <v-icon v-if="props.item.children" :icon="props.isActive ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="20" />
                </template>
                <template #prepend="{ item }">
                    <v-icon v-if="item.icon" :icon="item.icon" :size="20"></v-icon>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
            color="grey"
            height="48"
            flat
        ></v-app-bar>

        <v-navigation-drawer
            color="grey-lighten-1"
            location="right"
            width="150"
            permanent
        ></v-navigation-drawer>

        <v-app-bar
            color="grey-lighten-2"
            height="48"
            location="bottom"
            flat
        ></v-app-bar>

        <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            <router-view/>
        </v-main>
        <AppFooter/>

    </v-app>
</template>

<script lang="ts" setup>
import type { MdiIconName } from '@/types/icons.js';
import { VBadge, VList, VListItem } from 'vuetify/components';
type SidebarItemBadge = Partial<InstanceType<typeof VBadge>>
type SidebarItem = Partial<InstanceType<typeof VListItem>> & { icon?: MdiIconName, type?: string, badge?:SidebarItemBadge, children?: SidebarItem[] }

const drawer = ref<boolean>(true);
const rail = ref<boolean>(true);
const sidebarItems: SidebarItem[] = [
    // { type: 'subheader', title: 'Group 1' },
    { title: 'Dashboard', icon: 'mdi-view-dashboard' },
    { title: 'Configuration', icon: 'mdi-cog' },
    { title: 'Settings', icon: 'mdi-wrench', color:'#FFF', },
    { type: 'divider' },
    { type: 'subheader', title: rail.value ? 'Modules':'' },
    {
        title: 'Users', icon: 'mdi-account-multiple', children: [
            { title: 'Users', link: true, href: '#', to: '/' },
            { title: 'Roles', link: true },
            { title: 'Permissions', link: true },
        ],
    },
    { title: 'Pages', icon: 'mdi-file-document' },
    { title: 'Files', icon: 'mdi-file-multiple' },
    { title: 'Templates', icon: 'mdi-file-document-plus' },
    { title: 'Forms', icon: 'mdi-pencil' },
    { title: 'Navigation', icon: 'mdi-navigation' },
    { title: 'Addons', icon: 'mdi-puzzle', children:[
        { title: 'Themes', icon: 'mdi-theme-light-dark' },
        { title: 'Plugins', icon: 'mdi-puzzle' },
        { title: 'Widgets', icon: 'mdi-widgets' },
        ] },
    { title: 'Logs', icon: 'mdi-phone-log' },
    {
        title: 'Offline', icon: 'mdi-check-circle', children: [
            { title: 'Documents', icon: 'mdi-file-document' },
            { title: 'Images', icon: 'mdi-image' },
            { title: 'Videos', icon: 'mdi-video' },
        ],
    },
    { title: 'Uploads', icon: 'mdi-upload' },
    { title: 'Backups', icon: 'mdi-cloud-upload' },
];
</script>
<style lang="scss">
.r-sidebar__list {
    .v-list-group {
        --list-indent-size : 10px;
        --prepend-width    : 10px;
    }
    .v-list-item__prepend .v-list-item__spacer {
        width : 10px;
    }
}
</style>
