import type { RouteRecordRaw } from 'vue-router'

const categoryRoutes: RouteRecordRaw[] = [
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/views/category/index.vue'),
    meta: {
      title: '分类',
      keepAlive: true,
      showNavbar: true,
      showTabbar: true
    }
  }
]

export default categoryRoutes 