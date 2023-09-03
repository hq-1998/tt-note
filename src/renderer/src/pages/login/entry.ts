import { createApp } from 'vue'
import App from './index.vue'
import '@renderer/assets/css/styles.less'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())

app.mount('#app')
