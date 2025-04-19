<script setup lang="ts">
import type { SearchInstance } from 'vant'
const router = useRouter()
const searchRef = useTemplateRef<SearchInstance>('searchRef')
const searchValue = ref('')
const showHistory = ref(true)
const showHotSearch = ref(true)

// 搜索历史记录
const searchHistory = ref<string[]>([])
// 热门搜索
const hotSearchList = ref([
  { id: 1, keyword: '热门商品', count: 9999 },
  { id: 2, keyword: '夏季热卖', count: 8888 },
  { id: 3, keyword: '新品上市', count: 7777 },
  { id: 4, keyword: '限时折扣', count: 6666 },
  { id: 5, keyword: '品牌专区', count: 5555 },
  { id: 6, keyword: '特价商品', count: 4444 },
])

// 模拟搜索结果
const searchResults = ref<any[]>([])
const searching = ref(false)

// 获取搜索历史
const getSearchHistory = () => {
  const history = localStorage.getItem('searchHistory')
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
}

// 保存搜索历史
const saveSearchHistory = (keyword: string) => {
  if (!keyword.trim()) return

  // 移除重复项
  searchHistory.value = searchHistory.value.filter(item => item !== keyword)
  // 添加到最前面
  searchHistory.value.unshift(keyword)
  // 限制最多保存10条
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }

  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 清空搜索历史
const clearSearchHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

// 点击搜索历史或热门搜索项
const handleClickSearchItem = (keyword: string) => {
  searchValue.value = keyword
  handleSearch()
}

// 执行搜索
const handleSearch = () => {
  if (!searchValue.value.trim()) return

  searching.value = true
  showHistory.value = false
  showHotSearch.value = false

  // 保存搜索历史
  saveSearchHistory(searchValue.value)

  // 模拟搜索请求
  setTimeout(() => {
    // 这里应该从API获取搜索结果
    searchResults.value = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      title: `搜索结果 ${index + 1}: ${searchValue.value}`,
      description: `这是关于 "${searchValue.value}" 的搜索结果描述...`,
      image: `https://picsum.photos/seed/${index + 1}/300/200`
    }))
    searching.value = false
  }, 500)
}

// 取消搜索
const cancelSearch = () => {
  router.back()
}

// 清楚输入框
const clearInput = () => {
  searchValue.value = ''
  searchResults.value = []
  showHistory.value = true
  showHotSearch.value = true
}

// 组件挂载后自动聚焦输入框
onMounted(() => {
  getSearchHistory()

  // 延迟聚焦，避免页面过渡动画影响
  setTimeout(() => {
    searchRef.value?.focus()
  }, 500)
})
</script>

<template>
  <div class="search-page">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="search-input-wrapper">
        <van-search v-model="searchValue" show-action placeholder="请输入搜索关键词" shape="round" @search="handleSearch"
          @cancel="cancelSearch" @clear="clearInput" autofocus ref="searchRef">
        </van-search>
      </div>
    </div>

    <!-- 搜索历史和热门搜索 -->
    <div v-if="!searching && searchResults.length === 0" class="search-content">
      <!-- 搜索历史 -->
      <div v-if="showHistory && searchHistory.length > 0" class="search-history">
        <div class="search-section-header">
          <span class="section-title">搜索历史</span>
          <van-icon name="delete" class="clear-icon" @click="clearSearchHistory" />
        </div>
        <div class="history-tags">
          <div v-for="(item, index) in searchHistory" :key="index" class="history-tag"
            @click="handleClickSearchItem(item)">
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 热门搜索 -->
      <div v-if="showHotSearch" class="hot-search">
        <div class="search-section-header">
          <span class="section-title">热门搜索</span>
        </div>
        <div class="hot-search-list">
          <div v-for="(item, index) in hotSearchList" :key="item.id" class="hot-search-item"
            @click="handleClickSearchItem(item.keyword)">
            <div class="hot-rank" :class="{ 'top-rank': index < 3 }">{{ index + 1 }}</div>
            <div class="hot-keyword">{{ item.keyword }}</div>
            <div class="hot-count">{{ item.count > 9999 ? '9999+' : item.count }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-else class="search-results">
      <!-- 加载中 -->
      <div v-if="searching" class="searching-loading">
        <van-loading type="spinner" color="#1989fa" />
        <div class="loading-text">搜索中...</div>
      </div>

      <!-- 搜索结果列表 -->
      <div v-else-if="searchResults.length > 0" class="results-list">
        <div class="results-header">
          <span>搜索结果 ({{ searchResults.length }})</span>
        </div>
        <van-list>
          <div v-for="item in searchResults" :key="item.id" class="result-item">
            <div class="result-image">
              <van-image :src="item.image" radius="4" width="80" height="80" />
            </div>
            <div class="result-content">
              <div class="result-title">{{ item.title }}</div>
              <div class="result-description">{{ item.description }}</div>
            </div>
          </div>
        </van-list>
      </div>

      <!-- 无搜索结果 -->
      <div v-else-if="!searching && searchValue && searchResults.length === 0" class="no-results">
        <van-empty description="暂无搜索结果" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-page {
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
  position: relative;
}

.search-header {
  z-index: 100;
  position: sticky;
  top: 0;
  padding: 8px 0;
  background-color: #fff;
  border-bottom: 1px solid #ebedf0;

  .search-input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;

    :deep(.van-search) {
      flex: 1;
      padding: 0 12px;

      .van-search__content {
        background-color: #f5f5f7;
        border-radius: 16px;
      }

      .van-icon-clear {
        font-size: 22px;
      }

      .van-search__action {
        padding: 0 12px;
        font-size: 14px;
        color: #1989fa;
      }
    }
  }
}

.search-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.search-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .section-title {
    font-size: 15px;
    font-weight: 500;
    color: #323233;
  }

  .clear-icon {
    font-size: 16px;
    color: #969799;
  }
}

.search-history {
  margin-bottom: 24px;

  .history-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .history-tag {
      padding: 6px 12px;
      background-color: #fff;
      border-radius: 16px;
      font-size: 13px;
      color: #323233;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
  }
}

.hot-search {
  .hot-search-list {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);

    .hot-search-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 0.5px solid #ebedf0;

      &:last-child {
        border-bottom: none;
      }

      .hot-rank {
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        font-size: 12px;
        color: #969799;
        font-weight: bold;

        &.top-rank {
          color: #ee0a24;
        }
      }

      .hot-keyword {
        flex: 1;
        font-size: 14px;
        color: #323233;
      }

      .hot-count {
        font-size: 12px;
        color: #969799;
      }
    }
  }
}

.search-results {
  flex: 1;
  overflow-y: auto;
  background-color: #fff;

  .searching-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;

    .loading-text {
      margin-top: 12px;
      font-size: 14px;
      color: #969799;
    }
  }

  .results-header {
    padding: 12px 16px;
    font-size: 14px;
    color: #969799;
    background-color: #f7f8fa;
  }

  .result-item {
    display: flex;
    padding: 12px 16px;
    border-bottom: 0.5px solid #ebedf0;

    .result-image {
      margin-right: 12px;
      flex-shrink: 0;
    }

    .result-content {
      flex: 1;
      overflow: hidden;

      .result-title {
        font-size: 14px;
        font-weight: 500;
        color: #323233;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .result-description {
        font-size: 12px;
        color: #969799;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
}


.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .search-page {
    background-color: #121212;
  }

  .search-header {
    background-color: #1c1c1d;
    border-bottom-color: #2c2c2d;
  }

  .search-section-header {
    .section-title {
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .history-tag {
    background-color: #2c2c2d !important;
    color: rgba(255, 255, 255, 0.9) !important;
  }

  .hot-search-list {
    background-color: #1c1c1d !important;

    .hot-search-item {
      border-bottom-color: #2c2c2d;

      .hot-keyword {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .search-results {
    background-color: #1c1c1d;

    .results-header {
      background-color: #121212;
    }

    .result-item {
      border-bottom-color: #2c2c2d;

      .result-title {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}
</style>
