<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Tabbar from './components/Tabbar.vue'
const route = useRoute()

// 是否显示导航栏（可以根据路由元信息控制）
const showNavbar = computed(() => {
  return route.meta?.showNavbar === true
})

// 是否显示标签栏（可以根据路由元信息控制）
const showTabbar = computed(() => {
  return route.meta?.showTabbar === true
})

const oneScreen = computed(() => {
  return {
    'one-screen-height': route.meta?.oneScreen === true
  }
})


</script>

<template>
  <div class="layout-container" :class="oneScreen">
    <!-- 导航栏 -->
    <Navbar v-if="showNavbar" id="app-navbar" />

    <!-- 主内容区 -->
    <div class="main-content" ref="mainCRef">
      <!-- 使用 keep-alive 包裹路由视图，根据路由元信息判断是否缓存 -->
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component :is="Component" v-if="route.meta.keepAlive" :key="route.path" />
        </keep-alive>
        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.path" />
      </router-view>
    </div>

    <!-- 底部标签栏 -->
    <Tabbar v-if="showTabbar" id="app-tabbar" />
  </div>
</template>

<style scoped lang="scss">
.layout-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  --nav-bar-height: 0px;
  --tabbar-height: 0px;

  &:has(#app-navbar) {
    --nav-bar-height: var(--van-nav-bar-height);
  }

  &:has(#app-tabbar) {
    --tabbar-height: var(--van-tabbar-height);

    .main-content {
      padding-bottom: 0;
    }
  }

  &.one-screen-height {
    height: 100vh;
    height: 100dvh;
  }

  .main-content {
    flex: 1;
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>