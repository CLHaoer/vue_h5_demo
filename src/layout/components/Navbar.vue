<script setup lang="ts">
import { useNavbarStore } from '@/stores';
const {navConfig,slots} = storeToRefs(useNavbarStore())
</script>

<template>
  <!-- 普通页面导航 -->
  <van-nav-bar v-bind="navConfig">
    <template #right>
      <van-image class="size-[34px]" round fit="cover" src="https://tse3-mm.cn.bing.net/th/id/OIP-C.-ha6wAB8QEtiNtN5KPygnQAAAA?rs=1&pid=ImgDetMain"></van-image>
    </template>
    <template v-for="slot in slots" #[slot?.name]>
      <component :is="slot?.()" />
    </template>
  </van-nav-bar>

</template>

<style scoped lang="scss">
/* 导航栏基础样式 */
:deep(.van-nav-bar) {
  background-color: var(--van-nav-bar-background-color, #fff);
  z-index: 100;
}

:deep(.van-nav-bar__title) {
  width: 70%;
  font-size: 16px;
  font-weight: 500;
}
</style>