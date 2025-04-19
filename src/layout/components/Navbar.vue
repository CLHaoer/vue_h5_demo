<script setup lang="ts">
import { useTabbarStore, useUserStore } from '@/stores'
import { scanQrCode } from '@/components/scanqrcode'
import scanSuccess from '@/utils/scanner'
const route = useRoute()
const router = useRouter()
const title = ref('')
const { tabbarList } = useTabbarStore()
const { userInfo } = useUserStore()
// 根据路由设置标题
watch(() => route.meta.title, (newTitle) => {
  title.value = newTitle as string || import.meta.env.VITE_APP_TITLE
}, { immediate: true })

// 返回上一页
const onClickLeft = () => {
  history.back()
}
const isTabbar = computed(() => {
  return tabbarList.some((tab) => tab.path === route.path)
})

// 处理扫码按钮点击
const handleScan = async () => {
  try {
    const result = await scanQrCode({
      scanWidth: 280,
      scanHeight: 280,
      scanFps: 60, // 稍微降低扫描频率，提高兼容性
      showErrorToast: true, // 自动显示错误提示
      onError: (error) => {
        console.warn('扫码错误，但已由组件内部处理:', error.message)
      }
    })
    scanSuccess(result)
  } catch (error: any) {
    // 用户取消不需要处理
    if (error?.message === '用户取消扫码') {
      return
    }
    console.error('扫码过程发生错误:', error)
  }
}


</script>

<template>
  <!-- 首页专用导航栏 -->
  <van-nav-bar v-if="route.path === '/home'" fixed placeholder class="home-navbar" :border="false" safe-area-inset-top>
    <template #left>
      <div class="avatar-container" @click="router.push('/mine')">
        <van-image :src="userInfo?.avatar" fit="cover" round class="avatar-image" />
      </div>
    </template>
    <template #title>
      <van-search readonly input-align="center" placeholder="请输入搜索关键词" shape="round" class="search-input"
        background="transparent" @click="router.push('/search')" />
    </template>
    <template #right>
      <div class="right-icons">
        <van-icon name="scan" size="25" class="scan-icon" @click="handleScan" />
      </div>
    </template>
  </van-nav-bar>

  <!-- 标签栏页面导航 -->
  <van-nav-bar v-else-if="isTabbar" :title="title" fixed placeholder :border="false" safe-area-inset-top />

  <!-- 普通页面导航 -->
  <van-nav-bar v-else :title="title" left-arrow fixed placeholder :border="false" safe-area-inset-top
    @click-left="onClickLeft">
    <template #right>
      <slot name="right">
        <!-- 右侧默认插槽 -->
      </slot>
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

/* 首页导航栏样式 */
.home-navbar {
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
}

:deep(.home-navbar .van-nav-bar__content) {
  height: 56px;
  padding: 0 12px;
}

.avatar-container {
  display: flex;
  align-items: center;
  height: 100%;
}

.avatar-image {
  width: 34px;
  height: 34px;
  border: 1px solid #f5f5f5;
}

/* 搜索框样式 */
.search-input {
  width: 100%;
  padding: 0;

  :deep(.van-search__content) {
    background-color: #f5f5f7;
    border-radius: 30px;

    .van-field__left-icon {
      position: absolute;
      margin-left: 28px;
    }
  }
}


.right-icons {
  display: flex;
  align-items: center;
  height: 100%;
}

.scan-icon {
  margin-right: 4px;
  color: #333;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {

  :deep(.van-nav-bar),
  :deep(.search-input .van-search__content) {
    background-color: #1c1c1d;
  }

  :deep(.search-input .van-search__content) {
    color: rgba(255, 255, 255, 0.9);
  }

  .scan-icon {
    color: rgba(255, 255, 255, 0.9);
  }

  .home-navbar {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  }
}
</style>