import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// 自定义 Layout 设置
// export const useLayoutStore = defineStore('layout',()=>{
//   const route = useRoute()
//   const layoutConfig = reactive({
//     showNavbar: route?.meta?.showNavbar || false,
//     showTabbar: route?.meta?.showTabbar || false,
//     oneScreen: route?.meta?.oneScreen || false,
//     keepAlive: route?.meta?.keepAlive || false
//   })
//   watch(()=>route.path,()=>{
//     const keys = Object.keys(layoutConfig) as Array<keyof typeof layoutConfig>
//     if(route.meta['keepAlive']){
//       return layoutConfig['keepAlive'] = route.meta['keepAlive'] || false
//     }
//     keys.map((key)=>{
//       layoutConfig[key] = route.meta[key] || false
//     })
//   })
//   const setLayout = (name:keyof typeof layoutConfig,val?:boolean)=>{
//     layoutConfig[name] = val ?? !layoutConfig[name]
//   }
//   return{
//     layoutConfig,
//     setLayout
//   }
// })

// 自定义 Navbar 设置
export const useNavbarStore = defineStore('navbar',()=>{
  const route = useRoute()
  const navbarConfig = reactive({
    titile: route?.meta?.title || import.meta.env.VITE_APP_TITLE,
    leftArrow: false
  })
})
// 自定义 Tabbar 类型
type TabbarName = 'home'|'category'|'cart'|'mine'
export interface TabbarItem {
  name: TabbarName
  icon: string
  text: string
  path: string
  badge?: string | number
  url?: string
  dot?: boolean
}
export const useTabbarStore = defineStore('tabbar', () => {
  // 定义 tabbar 列表
  const tabbarList = ref<TabbarItem[]>([
    {
      name: 'home',
      icon: 'home-o',
      text: '首页',
      path: '/home',
    },
    {
      name: 'category',
      icon: 'apps-o',
      text: '分类',
      path: '/category',
    },
    {
      name: 'cart',
      icon: 'cart-o',
      text: '购物车',
      path: '/cart',
      badge: '',  // 购物车徽标，可以通过 action 更新
    },
    {
      name: 'mine',
      icon: 'user-o',
      text: '我的',
      path: '/mine',
    },
  ])

  // 获取当前路由，用于高亮显示当前 tabbar
  const route = useRoute()
  
  // 当前激活的 tabbar 索引
  const activeIndex = computed(() => {
    const path = route.path
    const index = tabbarList.value.findIndex(item => path.startsWith(item.path))
    return index >= 0 ? index : 0
  })
  
  // 当前激活的 tabbar 项
  const activeTabbar = computed(() => {
    return tabbarList.value[activeIndex.value]
  })
  
  // 更新购物车徽标
  const updateCartBadge = (count: TabbarItem['badge']) => {
    const cartItem = tabbarList.value.find(item => item.name === 'cart')
    if (cartItem) {
      cartItem.badge = count ? count : ''
    }
  }
  
  // 更新指定 tabbar 的徽标
  const updateBadge = (name:TabbarName, badge: TabbarItem['badge']) => {
    const item = tabbarList.value.find(item => item.name === name)
    if (item) {
      item.badge = badge ?? 0
    }
  }

  // 更新指定 tabbar 的dot
  const toggleDot = (name:TabbarName) =>{
    const item = tabbarList.value.find(item => item.name === name)
    if (item) {
      item.dot = !item.dot
    }
  }
  
  return {
    tabbarList,
    activeIndex,
    activeTabbar,
    updateCartBadge,
    updateBadge,
    toggleDot
  }
}) 