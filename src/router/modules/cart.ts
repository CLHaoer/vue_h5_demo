import type { RouteRecordRaw } from 'vue-router'

const cartRoutes: RouteRecordRaw[] = [
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/cart/index.vue'),
    meta: {
      title: '购物车',
      keepAlive: true,
      showNavbar: true,
      showTabbar: true,
    }
  }
]

export default cartRoutes 