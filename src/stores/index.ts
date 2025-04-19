import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// 创建 pinia 实例
export const pinia = createPinia()

// 持久化插件配置
const persistedState = createPersistedState({
  // 存储key前缀
  key: (id: string) => `vue_h5_demo_${id}`,
  // 默认使用 localStorage
  storage: localStorage
})



// 注册 pinia 插件
pinia.use(persistedState)

// 导出 store 模块
export * from './modules/user'
export * from './modules/app'
export * from './modules/layout'
