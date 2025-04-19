<script setup lang="ts">
import { useTabbarStore } from '@/stores'

const router = useRouter()
const tabbarStore = useTabbarStore()

// 获取 tabbar 列表和当前激活索引
const tabbarList = tabbarStore.tabbarList
const active = tabbarStore.activeIndex

// 切换标签（接收 name 参数而不是索引）
const onChange = (name: string) => {
  const item = tabbarList.find(item => item.name === name)
  if (item && router.currentRoute.value.path !== item.path) {
    router.push(item.path)
  }
}
</script>

<template>
  <van-tabbar v-model="active" route placeholder fixed safe-area-inset-bottom @change="onChange">
    <van-tabbar-item v-for="item in tabbarList" :key="item.name" :name="item.name" :icon="item.icon" :badge="item.badge"
      :to="item.path" :url="item.url" :dot="item.dot">
      {{ item.text }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>
:deep(.van-tabbar) {
  z-index: 100;
}

:deep(.van-tabbar-item--active) {
  color: var(--van-tabbar-item-active-color, #1989fa);
}
</style>