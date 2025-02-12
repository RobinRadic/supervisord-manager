/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    theme: {
        defaultTheme: 'mytheme',
        variations: {
            colors: [ 'primary', 'secondary', 'accent', 'error', 'warning', 'info', 'success' ],
            darken: 3,
            lighten: 3,
        },
        themes: {
            mytheme: {
                dark: true,
                colors: {
                    'background': '#121212',
                    'surface': '#212121',
                    'primary': '#255676',
                    'secondary': '#7c9eb4',
                    'accent': '#df8515',
                    'error': '#623239',
                    'info': '#2273ab',
                    'success': '#2c632f',
                    'warning': '#8d6530',
                },
            },
        },
    },
});
