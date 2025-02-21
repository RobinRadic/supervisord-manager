import type { App } from 'vue';
import router from '../router';
import pinia from '../stores';
import axios from './axios';
import vuetify from './vuetify';

export function registerPlugins(app: App) {
    app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(axios({

    }));
}
