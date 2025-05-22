import { createApp, type App } from 'vue'
import router from '@/router'
import { pinia } from '@/stores'
import MAIN from './App.vue'
import '@/assets/styles/global-clear.css'
import '@/assets/styles/tailwind.css'
import './utils/rem.ts'
import { Lazyload } from 'vant'


// 在开发环境中启用 VConsole 调试工具
if (import.meta.env.DEV) {
  import('vconsole').then(({ default: VConsole }) => {
    new VConsole({ theme: 'dark' })
    console.log('VConsole is enabled in development mode')
  })
}

const app = createApp(MAIN)
export const loadPlugins = (APP:App<Element>):App<Element> =>{
  return APP.use(router).use(pinia).use(Lazyload)
}

loadPlugins(app).mount('#app')

