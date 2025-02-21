<route lang="yaml">
meta:
    layout: blank
</route>
<template>

</template>

<script lang="ts" setup>
import { useAuth } from '../plugins/auth.js';

const router = useRouter();
const auth   = useAuth();

async function logout() {
     auth.logout();
    return router.push('/login');
}

logout();
</script>
