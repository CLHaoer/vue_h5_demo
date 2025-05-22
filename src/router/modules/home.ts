import type { RouteRecordRaw } from 'vue-router'

const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      keepAlive: true,
      showNavbar: false,
      showTabbar: true
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/home/search.vue'),
    meta: {
      title: '搜索',
      keepAlive: false,
      showNavbar: false,
      showTabbar: false
    }
  }
]

export default homeRoutes 