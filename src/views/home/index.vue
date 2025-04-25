<script setup lang="ts">
import type { SwipeInstance } from 'vant';
const swiper = useTemplateRef<SwipeInstance>('swiper')
const menus = ref([
[
  {
    name: '喜欢',
    icon: 'like-o',
  },
  {
    name: '收藏',
    icon: 'star-o',
  },
  {
    name: '优惠',
    icon: 'gift-o',
  },
  {
    name: '活动',
    icon: 'hot-o',
  },
  {
    name: '推荐',
    icon: 'friends-o',
  },
],
[
  {
    name: '设置',
    icon: 'setting-o',
  },
  {
    name: '关于',
    icon: 'info-o',
  },
  {
    name: '隐私',
    icon: 'lock',
  },
  {
    name: 'QQ',
    icon: 'qq',
  },
  {
    name: '更多',
    icon: 'more-o',
  },
  {
    name: '分享',
    icon: 'share-o',
  },
  {
    name: '会员',
    icon: 'vip-card',
  },
  {
    name: '正在进行',
    icon: 'underway',
  },
  {
    name: '音乐',
    icon: 'music',
  },
]
])
const swiperHeight = ref(62)
onMounted(()=>{
  console.log(swiper.value);
  
})

</script>

<template>
  <div class="p-[10px] @container">
    <van-swipe class="rounded-sm h-[200px]" :autoplay="3000" :show-indicators="false">
      <van-swipe-item v-for="(item, index) in 3" :key="index">
        <van-image class="size-full" :src="`https://picsum.photos/350/200?random=${index}`" alt="Image" fit="cover" />
      </van-swipe-item>
    </van-swipe>
    <van-swipe ref="swiper" :height="swiperHeight" class="flex pt-[10px] pb-[20px] w-full bg-gray-100 dark:bg-neutral-900 rounded-sm flex-row gap-x-[34px] mt-[10px] justify-between">
      <van-swipe-item v-for="(item, index) in menus" :key="index" class="grid grid-cols-5 items-center justify-items-center gap-y-[5px]">
        <div v-for="(menu,idx) in item" class="flex flex-col items-center justify-center">
          <van-icon :name="menu.icon" class="!text-[40px] text-[#333] dark:text-gray-100" />
          <span>{{ menu.name }}</span>
        </div>
      </van-swipe-item>
    </van-swipe>
    <div class="w-full grid items-center justify-items-center grid-cols-4 grid-rows-2 bg-gray-100 dark:bg-neutral-900 rounded-sm mt-[10px]">
      <div class="w-full border-b-[0.5px] border-b-neutral-200 p-[10px] col-span-4 flex items-center gap-x-[34px]">
        <div v-for="idx in 5" :key="idx" class="flex flex-col items-center justify-center gap-y-[5px]">
          <van-icon name="point-gift" class="!text-[40px] text-[#333] dark:text-gray-100" />
          <span class="text-[14px] text-[#333] dark:text-gray-100">推荐</span>
        </div>
      </div>
      <div class=" col-span-2">
        ssss
      </div>
      <div class="w-full flex border-l-[0.5px] p-[10px] border-l-neutral-200 flex-col items-center justify-center gap-y-[5px]">
        <van-icon name="point-gift" class="!text-[40px] text-[#333] dark:text-gray-100" />
          <span class="text-[14px] text-[#333] dark:text-gray-100">推荐</span>
      </div>  
      <div class="w-full flex border-l-[0.5px] p-[10px] border-l-neutral-200 flex-col items-center justify-center gap-y-[5px]">
        <van-icon name="point-gift" class="!text-[40px] text-[#333] dark:text-gray-100" />
          <span class="text-[14px] text-[#333] dark:text-gray-100">推荐</span>
      </div>
    </div>
    <van-list class="w-full mt-[10px]">
      <van-empty description="暂无数据"/>
    </van-list>
  </div>
</template>

<style scoped lang="scss">

</style>