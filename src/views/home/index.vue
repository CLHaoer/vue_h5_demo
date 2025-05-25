<script setup lang="ts">
import { useUserStore } from '@/stores'
import { scanQrCode } from '@/components/scanqrcode'
import scanSuccess from '@/utils/scanner'
import { parseAsync } from 'docx-preview';
import type { UploaderBeforeRead } from 'vant'
const router = useRouter()
const { userInfo } = useUserStore()
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

const fileList = shallowRef([])
const beforeRead:UploaderBeforeRead = (file)=>{
  if(!Array.isArray(file)){
    const options = {
      useBase64URL: true,
      renderEndnotes: false,
    }
    parseAsync(file,options).then((docx) => {
      console.log('docx:', docx);
      
    }).catch((error) => {
      console.error('Error rendering docx:', error)
    })
  }
  
  return false
}

</script>

<template>
  <div class="home_container">
    <van-nav-bar fixed placeholder class="home-navbar" :border="false" safe-area-inset-top>
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
    <div>
      <van-uploader v-model="fileList" :before-read="beforeRead" multiple accept="docx/*" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.home_container {

  /* 首页导航栏样式 */
  .home-navbar {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);

    :deep(.van-nav-bar__content) {
      height: 56px;
      padding: 0 12px;

      .van-nav-bar__title {
        width: 70%;
        font-size: 16px;
        font-weight: 500;
      }
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
          margin-left: 22px;
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
  }

}
</style>