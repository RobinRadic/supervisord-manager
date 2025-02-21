<template>
    <v-app v-if="loaded">
        <v-navigation-drawer
            v-if="auth.loggedIn.value"
            :color="layoutColors.sidebarLeft"
            width="256"
            class="r-layout__sidebar"
            permanent
        >
            <v-list>
                <v-list-item
                    prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
                    :subtitle="auth.user.value.email"
                    :title="auth.user.value.name"
                >
                    <template v-slot:append>

                        <v-btn
                            icon="mdi-chevron-left"
                            variant="text"
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

                @click:activate="sidebarClickHandler"
                @click:select="sidebarClickHandler"
            >
                <template #append="props">
                    <!--                    <v-icon icon="mdi-plus" size="20"></v-icon>-->
                    <v-badge v-if="props.item.badge" v-bind="props.item.badge"/>
                    <v-icon v-if="props.item.children" :icon="props.isActive ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="20"/>
                </template>
                <template #prepend="{ item }">
                    <v-icon v-if="item.icon" :icon="item.icon" :size="20"></v-icon>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-main class="r-layout__main d-flex align-center justify-center" style="min-height: 300px;">
            <v-app-bar
                :color="layoutColors.appbarInnerTop"
                height="48"
                flat

            >
                <v-breadcrumbs :items="breadcrumbs">

                    <template v-slot:prepend>
                        <v-icon icon="$vuetify" size="small"></v-icon>
                    </template>

                    <template v-slot:divider>
                        <v-icon icon="mdi-chevron-right"></v-icon>
                    </template>
                </v-breadcrumbs>

                <div class="flex-grow-1"></div>

                <template v-for="(component,i) in components"  :key="i" >
                    <component :is="component.component" v-bind="component.props"/>
                </template>
            </v-app-bar>
            <router-view/>
            <Alerts />
        </v-main>

        <AppFooter :color="layoutColors.footer"/>

    </v-app>
</template>

<script lang="ts" setup>


import useAppBarComponents from '@/composables/useAppBarComponents.js';
import type { MdiIconName } from '@/types/icons.js';
import { useRouter } from 'vue-router';
import { VBadge, VList, VListItem } from 'vuetify/components';
import { useBreadcrumbs } from '@/composables/useBreadcrumbs.js';
import { useAuth } from '../plugins/auth.js';
import { useSupervisor } from '@/plugins/supervisor/index.js';

const supervisor = useSupervisor();
const loaded     = ref(false);

Promise.all([
    supervisor.updateConfig(),
    supervisor.updateStatus(),
]).then(() => {
    loaded.value = true;
});

setInterval(() => {
    supervisor.updateStatus();
}, 5000);

const auth = useAuth()
const {registerBreadcrumbs,breadcrumbs} = useBreadcrumbs()
registerBreadcrumbs({
    index: { title: 'Supervisord Manager', path: '/' },
    settings: { parent: 'index', title: 'Settings', path: '/settings' },
    dashboard: { parent: 'index', title: 'Dashboard', path: '/dashboard' },
})

const router=window['router']=useRouter();
const {components} = useAppBarComponents()
type SidebarItemBadge = Partial<InstanceType<typeof VBadge>>
type SidebarItem = Partial<InstanceType<typeof VListItem>> & { icon?: MdiIconName, type?: string, badge?: SidebarItemBadge, children?: SidebarItem[] }
const layoutColors = reactive({
    sidebarLeft: '#37474F',
    appbarInnerTop: '#3D515F',
    appbarTop: '#263238',
    appbarBottom: '#263238',
    footer: '#263238',
});

const sidebarClickHandler         = (_item: SidebarItem) => {
    const item = sidebarItems.find(item => item.value === _item.id);
    if (item) {
        console.log('Clicked on', item.title);
        router.push(item.to);
    }
};
const sidebarItems: SidebarItem[] = [
    // { type: 'subheader', title: 'Group 1' },
    { value: 'dashboard', title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
    { value: 'settings', title: 'Settings', icon: 'mdi-wrench', to: '/settings' },
    // { type: 'divider' },
    // { type: 'subheader', title: 'Modules' },
    // {
    //     title: 'Users', icon: 'mdi-account-multiple', children: [
    //         { title: 'Users', link: true, href: '#', to: '/' },
    //         { title: 'Roles', link: true },
    //         { title: 'Permissions', link: true },
    //     ],
    // },
    // { title: 'Pages', icon: 'mdi-file-document' },
    // { title: 'Files', icon: 'mdi-file-multiple' },
    // { title: 'Templates', icon: 'mdi-file-document-plus' },
    // { title: 'Forms', icon: 'mdi-pencil' },
    // { title: 'Navigation', icon: 'mdi-navigation' },
    // { title: 'Addons', icon: 'mdi-puzzle', children:[
    //     { title: 'Themes', icon: 'mdi-theme-light-dark' },
    //     { title: 'Plugins', icon: 'mdi-puzzle' },
    //     { title: 'Widgets', icon: 'mdi-widgets' },
    //     ] },
    // { title: 'Logs', icon: 'mdi-phone-log' },
    // {
    //     title: 'Offline', icon: 'mdi-check-circle', children: [
    //         { title: 'Documents', icon: 'mdi-file-document' },
    //         { title: 'Images', icon: 'mdi-image' },
    //         { title: 'Videos', icon: 'mdi-video' },
    //     ],
    // },
    // { title: 'Uploads', icon: 'mdi-upload' },
    // { title: 'Backups', icon: 'mdi-cloud-upload' },
];

</script>
<style lang="scss">
.r-layout__main {
    .v-breadcrumbs__prepend {
        width : 30px;
    }
    .v-toolbar__content {
        .v-btn {
            //margin-left: 3px;
        }
    }
}
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
