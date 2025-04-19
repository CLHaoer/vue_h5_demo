<script setup lang="ts">
import { showToast, showDialog } from 'vant'

const isDarkMode = ref(false)
const isAgreePrivacy = ref(true)

// 切换暗黑模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  // 这里可以调用 store 中的方法来实际切换主题
}
</script>

<template>
  <div class="setting-container">
    <van-cell-group inset title="基本设置">
      <van-cell center title="深色模式">
        <template #right-icon>
          <van-switch v-model="isDarkMode" @change="toggleDarkMode" />
        </template>
      </van-cell>
      <van-cell title="清除缓存" is-link @click="showToast('缓存已清除')" />
      <van-cell title="关于我们" is-link to="/about" />
    </van-cell-group>

    <van-cell-group inset title="隐私设置" class="mt-3">
      <van-cell center title="隐私协议">
        <template #right-icon>
          <van-checkbox v-model="isAgreePrivacy" shape="square" />
        </template>
      </van-cell>
      <van-cell title="位置信息" is-link />
      <van-cell title="通知权限" is-link />
    </van-cell-group>

    <van-cell-group inset title="账号安全" class="mt-3">
      <van-cell title="修改密码" is-link to="/change-password" />
      <van-cell title="账号注销" is-link @click="showDialog({
        title: '提示',
        message: '确定要注销账号吗？该操作不可撤销！',
        showCancelButton: true,
      })" />
    </van-cell-group>

    <div class="logout-btn">
      <van-button block type="danger" @click="showDialog({
        title: '提示',
        message: '确定要退出登录吗？',
        showCancelButton: true,
      })">
        退出登录
      </van-button>
    </div>
  </div>
</template>

<style scoped>
.setting-container {
  padding: 16px;
  min-height: 100%;
  background-color: #f8f8f8;
}

.mt-3 {
  margin-top: 12px;
}

.logout-btn {
  margin: 20px 16px;
}
</style>