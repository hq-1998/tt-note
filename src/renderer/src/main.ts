import { createApp } from 'vue'
import App from './App.vue'
import 'bytemd/dist/index.css'
import { Message } from '@arco-design/web-vue'
import { createPinia } from 'pinia'
import router from './router'
import 'virtual:svg-icons-register'

const app = createApp(App)
app.use(createPinia())
app.use(router)
Message._context = app._context
app.mount('#app')
