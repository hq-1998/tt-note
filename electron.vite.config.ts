import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig(() => {
  return {
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      // https://api.hq-cll.vip/users/login'
      server: {
        cors: true,
        proxy: {
          '/api': {
            target: 'https://api.hq-cll.vip',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      },
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@src': resolve('src'),
          '@views': resolve('src/renderer/src/views')
        }
      },
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'src/renderer/index.html'),
            setting: resolve(__dirname, 'src/renderer/setting.html'),
            login: resolve(__dirname, 'src/renderer/login.html')
          }
        }
      },
      plugins: [
        vue({
          script: {
            defineModel: true
          }
        }),
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
          style: 'css'
        })
      ]
    }
  }
})
