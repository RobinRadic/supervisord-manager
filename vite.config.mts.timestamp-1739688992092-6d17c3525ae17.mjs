// vite.config.mts
import Vue from "file:///home/radic/projects/vuetify/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { config } from "file:///home/radic/projects/vuetify/node_modules/dotenv/lib/main.js";
import { fileURLToPath, URL } from "node:url";
import { dirname, join } from "path";
import AutoImport from "file:///home/radic/projects/vuetify/node_modules/unplugin-auto-import/dist/vite.js";
import Fonts from "file:///home/radic/projects/vuetify/node_modules/unplugin-fonts/dist/vite.mjs";
import Components from "file:///home/radic/projects/vuetify/node_modules/unplugin-vue-components/dist/vite.js";
import VueRouter from "file:///home/radic/projects/vuetify/node_modules/unplugin-vue-router/dist/vite.js";
import { defineConfig } from "file:///home/radic/projects/vuetify/node_modules/vite/dist/node/index.js";
import Layouts from "file:///home/radic/projects/vuetify/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Vuetify, { transformAssetUrls } from "file:///home/radic/projects/vuetify/node_modules/vite-plugin-vuetify/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///home/radic/projects/vuetify/vite.config.mts";
var _dirname = dirname(fileURLToPath(__vite_injected_original_import_meta_url));
config({
  debug: true,
  path: join(_dirname, ".env")
});
console.log("process.env.SERVER_PORT", process.env.SERVER_PORT);
var vite_config_default = defineConfig({
  define: {
    "process.env": {},
    "__SERVER_PORT__": process.env.SERVER_PORT
  },
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    },
    extensions: [
      ".js",
      ".json",
      ".jsx",
      ".mjs",
      ".ts",
      ".tsx",
      ".vue"
    ]
  },
  server: {
    port: 3e3
    // https:true
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: []
    }
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern-compiler",
        silenceDeprecations: ["global-builtin", "import", "color-functions", "legacy-js-api", "mixed-decls"]
      }
    }
  },
  plugins: [
    // viteBasicSSlPlugin({
    //
    // }),
    VueRouter({
      dts: "src/typed-router.d.ts"
    }),
    Layouts(),
    AutoImport({
      imports: [
        "vue",
        {
          "vue-router/auto": ["useRoute", "useRouter"]
        }
      ],
      dts: "src/auto-imports.d.ts",
      eslintrc: {
        enabled: true
      },
      vueTemplate: true
    }),
    Components({
      dts: "src/components.d.ts"
    }),
    Vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss"
      }
    }),
    Fonts({
      google: {
        families: [{
          name: "Roboto",
          styles: "wght@100;300;400;500;700;900"
        }]
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvcmFkaWMvcHJvamVjdHMvdnVldGlmeVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcmFkaWMvcHJvamVjdHMvdnVldGlmeS92aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvcmFkaWMvcHJvamVjdHMvdnVldGlmeS92aXRlLmNvbmZpZy5tdHNcIjtcbi8vIFBsdWdpbnNcbmltcG9ydCBWdWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJ2RvdGVudic7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgeyBkaXJuYW1lLCBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJztcbmltcG9ydCBGb250cyBmcm9tICd1bnBsdWdpbi1mb250cy92aXRlJztcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnO1xuaW1wb3J0IFZ1ZVJvdXRlciBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyL3ZpdGUnO1xuXG4vLyBVdGlsaXRpZXNcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IExheW91dHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWxheW91dHMnO1xuaW1wb3J0IFZ1ZXRpZnksIHsgdHJhbnNmb3JtQXNzZXRVcmxzIH0gZnJvbSAndml0ZS1wbHVnaW4tdnVldGlmeSc7XG5cbmNvbnN0IF9kaXJuYW1lID0gZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpXG5cbmNvbmZpZyh7XG4gICAgZGVidWc6dHJ1ZSxcbiAgICBwYXRoOmpvaW4oX2Rpcm5hbWUsJy5lbnYnKVxufSlcblxuY29uc29sZS5sb2coJ3Byb2Nlc3MuZW52LlNFUlZFUl9QT1JUJywgcHJvY2Vzcy5lbnYuU0VSVkVSX1BPUlQpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBkZWZpbmU6IHtcbiAgICAgICAgJ3Byb2Nlc3MuZW52Jzoge30sXG4gICAgICAgICdfX1NFUlZFUl9QT1JUX18nOiBwcm9jZXNzLmVudi5TRVJWRVJfUE9SVCxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgIHZ1ZTogJ3Z1ZS9kaXN0L3Z1ZS5lc20tYnVuZGxlci5qcycsXG4gICAgICAgICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICAgfSxcbiAgICAgICAgZXh0ZW5zaW9uczogW1xuICAgICAgICAgICAgJy5qcycsXG4gICAgICAgICAgICAnLmpzb24nLFxuICAgICAgICAgICAgJy5qc3gnLFxuICAgICAgICAgICAgJy5tanMnLFxuICAgICAgICAgICAgJy50cycsXG4gICAgICAgICAgICAnLnRzeCcsXG4gICAgICAgICAgICAnLnZ1ZScsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgcG9ydDogMzAwMCxcbiAgICAgICAgLy8gaHR0cHM6dHJ1ZVxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgICAgICBwbHVnaW5zOiBbXSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgICAgICBzYXNzOiB7XG4gICAgICAgICAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcbiAgICAgICAgICAgICAgICBzaWxlbmNlRGVwcmVjYXRpb25zOiBbICdnbG9iYWwtYnVpbHRpbicsICdpbXBvcnQnLCAnY29sb3ItZnVuY3Rpb25zJywgJ2xlZ2FjeS1qcy1hcGknLCAnbWl4ZWQtZGVjbHMnIF0sXG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIC8vIHZpdGVCYXNpY1NTbFBsdWdpbih7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIH0pLFxuICAgICAgICBWdWVSb3V0ZXIoe1xuICAgICAgICAgICAgZHRzOiAnc3JjL3R5cGVkLXJvdXRlci5kLnRzJyxcbiAgICAgICAgfSksXG4gICAgICAgIExheW91dHMoKSxcbiAgICAgICAgQXV0b0ltcG9ydCh7XG4gICAgICAgICAgICBpbXBvcnRzOiBbXG4gICAgICAgICAgICAgICAgJ3Z1ZScsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAndnVlLXJvdXRlci9hdXRvJzogWyAndXNlUm91dGUnLCAndXNlUm91dGVyJyBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZHRzOiAnc3JjL2F1dG8taW1wb3J0cy5kLnRzJyxcbiAgICAgICAgICAgIGVzbGludHJjOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICAgICAgZHRzOiAnc3JjL2NvbXBvbmVudHMuZC50cycsXG4gICAgICAgIH0pLFxuICAgICAgICBWdWUoe1xuICAgICAgICAgICAgdGVtcGxhdGU6IHsgdHJhbnNmb3JtQXNzZXRVcmxzIH0sXG5cbiAgICAgICAgfSksXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS1sb2FkZXIvdHJlZS9tYXN0ZXIvcGFja2FnZXMvdml0ZS1wbHVnaW4jcmVhZG1lXG4gICAgICAgIFZ1ZXRpZnkoe1xuICAgICAgICAgICAgYXV0b0ltcG9ydDogdHJ1ZSxcbiAgICAgICAgICAgIHN0eWxlczoge1xuICAgICAgICAgICAgICAgIGNvbmZpZ0ZpbGU6ICdzcmMvc3R5bGVzL3NldHRpbmdzLnNjc3MnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIEZvbnRzKHtcbiAgICAgICAgICAgIGdvb2dsZToge1xuICAgICAgICAgICAgICAgIGZhbWlsaWVzOiBbIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1JvYm90bycsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlczogJ3dnaHRAMTAwOzMwMDs0MDA7NTAwOzcwMDs5MDAnLFxuICAgICAgICAgICAgICAgIH0gXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgIF0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxPQUFPLFNBQVM7QUFDaEIsU0FBUyxjQUFjO0FBQ3ZCLFNBQVMsZUFBZSxXQUFXO0FBQ25DLFNBQVMsU0FBUyxZQUFZO0FBQzlCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sV0FBVztBQUNsQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGVBQWU7QUFHdEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sV0FBVywwQkFBMEI7QUFkcUgsSUFBTSwyQ0FBMkM7QUFnQmxOLElBQU0sV0FBVyxRQUFRLGNBQWMsd0NBQWUsQ0FBQztBQUV2RCxPQUFPO0FBQUEsRUFDSCxPQUFNO0FBQUEsRUFDTixNQUFLLEtBQUssVUFBUyxNQUFNO0FBQzdCLENBQUM7QUFFRCxRQUFRLElBQUksMkJBQTJCLFFBQVEsSUFBSSxXQUFXO0FBRzlELElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFFBQVE7QUFBQSxJQUNKLGVBQWUsQ0FBQztBQUFBLElBQ2hCLG1CQUFtQixRQUFRLElBQUk7QUFBQSxFQUNuQztBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0gsS0FBSztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN4RDtBQUFBLElBQ0EsWUFBWTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ0osTUFBTTtBQUFBO0FBQUEsRUFFVjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1YsZ0JBQWdCO0FBQUEsTUFDWixTQUFTLENBQUM7QUFBQSxJQUNkO0FBQUEsRUFDSjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0QscUJBQXFCO0FBQUEsTUFDakIsTUFBTTtBQUFBLFFBQ0YsS0FBSztBQUFBLFFBQ0wscUJBQXFCLENBQUUsa0JBQWtCLFVBQVUsbUJBQW1CLGlCQUFpQixhQUFjO0FBQUEsTUFFekc7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBLElBSUwsVUFBVTtBQUFBLE1BQ04sS0FBSztBQUFBLElBQ1QsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLE1BQ1AsU0FBUztBQUFBLFFBQ0w7QUFBQSxRQUNBO0FBQUEsVUFDSSxtQkFBbUIsQ0FBRSxZQUFZLFdBQVk7QUFBQSxRQUNqRDtBQUFBLE1BQ0o7QUFBQSxNQUNBLEtBQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxRQUNOLFNBQVM7QUFBQSxNQUNiO0FBQUEsTUFDQSxhQUFhO0FBQUEsSUFDakIsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1AsS0FBSztBQUFBLElBQ1QsQ0FBQztBQUFBLElBQ0QsSUFBSTtBQUFBLE1BQ0EsVUFBVSxFQUFFLG1CQUFtQjtBQUFBLElBRW5DLENBQUM7QUFBQTtBQUFBLElBRUQsUUFBUTtBQUFBLE1BQ0osWUFBWTtBQUFBLE1BQ1osUUFBUTtBQUFBLFFBQ0osWUFBWTtBQUFBLE1BQ2hCO0FBQUEsSUFDSixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsTUFDRixRQUFRO0FBQUEsUUFDSixVQUFVLENBQUU7QUFBQSxVQUNSLE1BQU07QUFBQSxVQUNOLFFBQVE7QUFBQSxRQUNaLENBQUU7QUFBQSxNQUNOO0FBQUEsSUFDSixDQUFDO0FBQUEsRUFDTDtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
