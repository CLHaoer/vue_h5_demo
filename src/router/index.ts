import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 动态导入路由模块
// 获取所有模块
const moduleFiles = import.meta.glob('./modules/*.ts', { eager: true })

// 解析所有路由模块
const moduleRoutes: RouteRecordRaw[] = []
Object.keys(moduleFiles).forEach(key => {
  const mod = moduleFiles[key] as any
  const routes = mod.default || []
  moduleRoutes.push(...routes)
})

// 根路由
const rootRoute: RouteRecordRaw = {
  path: '/',
  component: () => import('@/layout/index.vue'),
  redirect: '/home',
  children: moduleRoutes
}

// 其他路由
const routes: RouteRecordRaw[] = [
  rootRoute,
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      showNavbar: false,
      showTabbar: false
    }
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      showNavbar: true,
      showTabbar: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置标题
  document.title = (to.meta.title as string) || 'Vue H5 Demo'
  
  // 这里可以添加登录验证等逻辑
  // const token = localStorage.getItem('token')
  // if (!token && to.path !== '/login') {
  //   next('/login')
  // } else {
  //   next()
  // }
  
  next()
})

export default router 