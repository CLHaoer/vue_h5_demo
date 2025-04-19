<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>页面不存在</p>
      <van-button type="primary" size="small" @click="goHome">返回首页</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button as VanButton } from 'vant'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
}

.content {
  text-align: center;
}

h1 {
  font-size: 80px;
  color: #ccc;
  margin: 0;
  line-height: 1.2;
}

p {
  font-size: 18px;
  color: #666;
  margin: 16px 0 24px;
}
</style>