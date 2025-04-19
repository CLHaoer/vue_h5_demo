<script setup lang="ts">
const items = ref([
  { id: 1, title: '商品1', price: 100, count: 1, checked: true },
  { id: 2, title: '商品2', price: 200, count: 2, checked: false }
])

const checkedAll = ref(false)
const isIndeterminate = ref(false)

const toggleAll = () => {
  items.value.map(item => {
    item.checked = checkedAll.value
  })
}
watchEffect(() => {
  if (!unref(items).length) return checkedAll.value = false
  checkedAll.value = items.value.every((item) => item.checked)
  if (unref(checkedAll)) isIndeterminate.value = false
  else isIndeterminate.value = items.value.some((item) => item.checked)
})

const deleteItem = (id: number) => {
  const index = items.value.findIndex(item => item.id === id)
  if (index !== -1) {
    items.value.splice(index, 1)
  }
}

const totalPrice = ref(0)
</script>

<template>
  <div class="cart-container">
    <div class="cart-list" v-if="items.length > 0">
      <van-swipe-cell v-for="item in items" :key="item.id">
        <template #default>
          <div class="cart-item">
            <van-checkbox v-model="item.checked" />
            <div class="item-info">
              <div class="item-title">{{ item.title }}</div>
              <div class="item-price">¥{{ item.price }}</div>
            </div>
            <div class="item-count">
              x{{ item.count }}
            </div>
          </div>
        </template>
        <template #right>
          <van-button square type="danger" class="!h-full" text="删除" @click="deleteItem(item.id)" />
        </template>
      </van-swipe-cell>
    </div>
    <van-empty v-else class="flex-1" description="购物车空空如也" />

    <fixed-placeholder>
      <div class="cart-footer">
        <div class="select-all">
          <van-checkbox v-model="checkedAll" :indeterminate="isIndeterminate" @click="toggleAll">全选</van-checkbox>
        </div>
        <div class="total-price">
          合计: <span>¥{{ totalPrice }}</span>
        </div>
        <div class="checkout-btn">
          <van-button type="danger" round>结算</van-button>
        </div>
      </div>
    </fixed-placeholder>
  </div>
</template>

<style scoped>
.cart-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cart-list {
  flex: 1;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #fff;
}

.item-info {
  flex: 1;
  margin-left: 10px;
}

.item-title {
  font-size: 14px;
}

.item-price {
  color: #f44;
  font-weight: 500;
  margin-top: 4px;
}

.item-count {
  color: #999;
}

.cart-footer {
  position: fixed;
  bottom: var(--tabbar-height);
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #fff;
  border-top: 1px solid #eee;
  width: 100%;
}

.select-all {
  flex: 1;
}

.total-price {
  margin: 0 10px;
}

.total-price span {
  color: #f44;
  font-weight: bold;
}
</style>