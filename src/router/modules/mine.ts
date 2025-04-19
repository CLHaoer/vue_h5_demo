import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/views/mine/index.vue'),
    meta: {
      title: '我的',
      keepAlive: true,
      showNavbar: true,
      showTabbar: true
    }
  },
  {
    path: '/mine/setting',
    name: 'Setting',
    component: () => import('@/views/mine/setting.vue'),
    meta: {
      title: '设置',
      keepAlive: false
    }
  }
]

export default routes 