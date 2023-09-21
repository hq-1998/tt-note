import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(() => {
  return {
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      css: {
        preprocessorOptions: {
          less: {
            modifyVars: {
              'color-primary-6': '#5d7af9'
            }
          }
        }
      },
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
        createSvgIconsPlugin({
          iconDirs: [resolve(__dirname, 'src/renderer/src/assets/images/svg')],
          symbolId: 'icon-[name]'
        }),
        vueJsx(),
        AutoImport({
          resolvers: [ArcoResolver()]
        }),
        Components({
          resolvers: [
            ArcoResolver({
              importStyle: 'less'
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
