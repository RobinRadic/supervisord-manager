<template>
    <v-app>
        <v-main class="r-layout__main d-flex align-center justify-center" style="min-height: 300px;">
            <router-view/>
            <Alerts />
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>

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
