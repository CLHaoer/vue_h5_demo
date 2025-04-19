<template>
  <div class="login-container">
    <div class="login-header">
      <h2>用户登录</h2>
    </div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="username" name="username" label="用户名" placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]" />
        <van-field v-model="password" type="password" name="password" label="密码" placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]" />
      </van-cell-group>
      <div class="submit-btn">
        <van-button round block type="primary" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const username = ref('')
const password = ref('')

const onSubmit = () => {
  // 模拟登录
  setTimeout(() => {
    // 保存 token 到本地
    localStorage.setItem('token', 'demo-token')

    showToast({
      type: 'success',
      message: '登录成功',
      onClose: () => {
        router.push('/home')
      }
    })
  }, 1000)
}
</script>

<style scoped>
.login-container {
  padding: 40px 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  font-size: 24px;
  color: #333;
}

.submit-btn {
  margin: 20px 16px;
}
</style>