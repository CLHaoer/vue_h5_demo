import { createApp } from 'vue'
import router from '@/router'
import { pinia } from '@/stores'
import App from './App.vue'
import '@/assets/styles/global-clear.css'
import '@/assets/styles/tailwind.css'
import './utils/rem.ts'


// 在开发环境中启用 VConsole 调试工具
if (import.meta.env.DEV) {
  import('vconsole').then(({ default: VConsole }) => {
    new VConsole({ theme: 'dark' })
    console.log('VConsole is enabled in development mode')
  })
}

const app = createApp(App)

app.use(router).use(pinia).mount('#app')
