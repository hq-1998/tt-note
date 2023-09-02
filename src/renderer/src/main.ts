import { createApp } from 'vue'
import App from './App.vue'
import 'bytemd/dist/index.css'
import { Message } from '@arco-design/web-vue'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
Message._context = app._context
app.mount('#app')
