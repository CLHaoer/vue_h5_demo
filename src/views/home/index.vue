<script setup lang="ts">
import { useTabbarStore } from '@/stores';
const { toggleDot } = useTabbarStore()
const route = useRoute()
const count = ref(0)

const btn = () => {
  count.value++
  toggleDot('cart')
  route.meta.showNavbar = !route.meta.showNavbar
  route.meta.title = unref(count).toString()
}
onMounted(() => {
  console.log('homeMounted');
})
onActivated(() => {
  console.log('home-activated');
})
</script>

<template>
  <div class="home-container">
    <h1 class="title">首页</h1>
    <p class="desc">欢迎使用 Vue H5 Demo{{ count }}</p>
    <van-button @click="btn">点击</van-button>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
}

.desc {
  font-size: 16px;
  color: #666;
}
</style>