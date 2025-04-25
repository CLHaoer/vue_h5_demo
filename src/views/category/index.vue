<script setup lang="ts">
import {mock} from 'mockjs'
const items = mock({
  'items|10': [
    {
      id: '@id',
      img: '@image',
      desc: '@csentence(5,20)'
    },
  ],
}).items
console.log(items);

</script>

<template>
  <div class="category-container">
    <!-- <h1 class="title">分类页面</h1>
    <div class="category-content">
      <div class="category-item" v-for="item in 30" :key="item">
        分类项 {{ item }}
      </div>
    </div> -->
    <WaterFall :cols="2" :list="items" :gap="10">
      <template #default="{ item, index }">
        <div class="category-item mb-[10px]">
          <van-image :src="item.img" fit="cover" width="100%" />
          <div>{{ item.desc }}</div>
        </div>
      </template>
    </WaterFall>
  </div>
</template>

<style scoped>
.category-container {
  padding: 16px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

.category-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.category-item {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}
</style>