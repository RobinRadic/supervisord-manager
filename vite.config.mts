// Plugins
import Vue from '@vitejs/plugin-vue';
import { config } from 'dotenv';
import { fileURLToPath, URL } from 'node:url';
import { dirname, join } from 'path';
import type { Options as SassOptions } from 'sass';
import AutoImport from 'unplugin-auto-import/vite';
import Fonts from 'unplugin-fonts/vite';
import Components from 'unplugin-vue-components/vite';
import VueRouter from 'unplugin-vue-router/vite';

// Utilities
import { defineConfig } from 'vite';
import Layouts from 'vite-plugin-vue-layouts';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

const _dirname = dirname(fileURLToPath(import.meta.url));

config({
    debug: true,
    path: join(_dirname, '.env'),
});

console.log('process.env.SERVER_PORT', process.env.SERVER_PORT);


// https://vitejs.dev/config/
export default defineConfig({
    define: {
        'process.env': {},
        '__SERVER_PORT__': process.env.SERVER_PORT,
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
        ],
    },

    build: {
        outDir: 'dist/frontend',
        rollupOptions: {

            output: {
                entryFileNames: 'assets/index.js',
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
    server: {
        port: 3000,
        // https:true
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [],
        },
    },
    css: {
        preprocessorOptions: {
            sass: {
                api: 'modern-compiler',
                silenceDeprecations: [ 'global-builtin', 'import', 'color-functions', 'legacy-js-api', 'mixed-decls' ],
                quietDeps: true,
            } as SassOptions,
        },
    },
    plugins: [
        // viteBasicSSlPlugin({
        //
        // }),
        VueRouter({
            dts: 'src/typed-router.d.ts',
        }),
        Layouts(),
        AutoImport({
            imports: [
                'vue',
                {
                    'vue-router/auto': [ 'useRoute', 'useRouter' ],
                },
            ],
            dts: 'src/auto-imports.d.ts',
            eslintrc: {
                enabled: true,
            },
            vueTemplate: true,
        }),
        Components({
            dts: 'src/components.d.ts',
        }),
        Vue({
            template: { transformAssetUrls },

        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
        Vuetify({
            autoImport: true,
            styles: {
                configFile: 'src/styles/settings.scss',
            },
        }),
        Fonts({
            google: {
                families: [ {
                    name: 'Roboto',
                    styles: 'wght@100;300;400;500;700;900',
                } ],
            },
        }),
    ],
});
