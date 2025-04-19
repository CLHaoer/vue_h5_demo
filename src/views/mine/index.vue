<script setup lang="ts">
const router = useRouter()

const userInfo = ref({
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  nickname: '用户昵称',
  phone: '138****1234'
})

const menuItems = [
  { icon: 'star-o', text: '我的收藏', path: '/favorite' },
  { icon: 'coupon-o', text: '优惠券', path: '/coupon' },
  { icon: 'location-o', text: '收货地址', path: '/address' },
  { icon: 'points', text: '我的积分', path: '/points' },
  { icon: 'service-o', text: '联系客服', path: '/service' }
]

// 跳转到设置页面
const goToSetting = () => {
  router.push('/mine/setting')
}

const logout = () => {
  showConfirmDialog({
    title: '提示',
    message: '确定要退出登录吗？',
  }).then(() => {
    localStorage.removeItem('token')
    showToast('已退出登录')
    router.push('/login')
  }).catch(() => {
    // 点击取消
  })
}
</script>

<template>
  <div class="mine-container">
    <!-- 用户信息 -->
    <div class="user-info">
      <div class="avatar">
        <van-image round width="64" height="64" :src="userInfo.avatar" />
      </div>
      <div class="user-detail">
        <div class="nickname">{{ userInfo.nickname }}</div>
        <div class="phone">{{ userInfo.phone }}</div>
      </div>
    </div>

    <!-- 菜单列表 -->
    <van-cell-group inset class="menu-group">
      <van-cell v-for="item in menuItems" :key="item.text" :title="item.text" is-link :icon="item.icon" />
    </van-cell-group>

    <!-- 设置 -->
    <van-cell-group inset class="menu-group">
      <van-cell title="设置" is-link icon="setting-o" @click="goToSetting" />
      <van-cell title="退出登录" @click="logout" icon="cross" />
    </van-cell-group>
  </div>
</template>

<style scoped>
.mine-container {
  padding: 16px;
  background-color: #f8f8f8;
  min-height: 100%;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
}

.avatar {
  margin-right: 16px;
}

.user-detail {
  flex: 1;
}

.nickname {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
}

.phone {
  font-size: 14px;
  color: #999;
}

.menu-group {
  margin-bottom: 16px;
}
</style>