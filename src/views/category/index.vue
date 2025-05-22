<script setup lang="ts">
import { mock } from 'mockjs'
import { getImageList } from '@/api'
const list = ref<any[]>([])

// 列表
const loading = ref(false)
const finished = ref(false)
const page = ref(1)
const loadMore = async () => {
  console.log('loadMore');
  loading.value = true
  const res = await getImageList({ page: page.value, limit: 10 })
  res.forEach(item => {
    item.desc = mock('@ctitle(5,20)')
  })
  list.value = list.value.concat(res)
  loading.value = false
  page.value++
  list.value.length >= 30 && (finished.value = true)
}
// 下拉刷新
const refreshLoadding = ref(false)
const onRefresh = async () => {
  finished.value = false
  refreshLoadding.value = true
  const res = await getImageList({ page: 1, limit: 10 })
  res.forEach(item => {
    item.desc = mock('@ctitle(5,20)')
  })
  refreshLoadding.value = false
  list.value = res
  page.value = 2
}
// item
const handleClick = (item: any) => {
  window.open(item.url, '_blank')
}
</script>

<template>
  <div class="category-container">
    <van-pull-refresh v-model="refreshLoadding" :head-height="80" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" @load="loadMore">
        <WaterFall :cols="2" :list="list" :gap="[10, 20]" #default="{ item }">
          <div class="category-item" @click="handleClick(item)">
            <van-image :src="item.download_url" lazy-load fit="cover" width="100%" />
            <div>{{ item.desc }}</div>
          </div>
        </WaterFall>
      </van-list>
    </van-pull-refresh>
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