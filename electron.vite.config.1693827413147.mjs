// electron.vite.config.ts
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";
import { vitePluginForArco } from "@arco-plugins/vite-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
var __electron_vite_injected_dirname = "/Users/huangqiang/projects/tt-note";
var electron_vite_config_default = defineConfig(({ mode }) => {
  return {
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      resolve: {
        alias: {
          "@renderer": resolve("src/renderer/src"),
          "@src": resolve("src")
        }
      },
      build: {
        rollupOptions: {
          input: {
            index: resolve(__electron_vite_injected_dirname, "./src/renderer/index.html"),
            setting: resolve(__electron_vite_injected_dirname, "./src/renderer/setting.html"),
            login: resolve(__electron_vite_injected_dirname, "./src/renderer/login.html")
          }
        }
      },
      plugins: [
        vue(),
        vueJsx(),
        AutoImport({
          resolvers: [ArcoResolver()]
        }),
        Components({
          resolvers: [
            ArcoResolver({
              sideEffect: true
            })
          ]
        }),
        vitePluginForArco({
          style: "css"
        })
      ]
    }
  };
});
export {
  electron_vite_config_default as default
};
