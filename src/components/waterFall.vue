<script setup lang='ts'>
import { vResizeObserver } from '@vueuse/components'
import { loadPlugins } from '@/main';
const { gap = 0, list, cols = 2 } = defineProps<{
  cols?: number
  gap?: number | [number, number]
  list: any[]
}>()
const slots = useSlots()

const container = useTemplateRef<HTMLElement>('container')
const { width } = useElementSize(container)
const Gap = computed(() => {
  if (Array.isArray(gap)) {
    return {
      col: gap[0],
      row: gap[1],
    }
  }
  return {
    col: gap,
    row: gap,
  }
})
const colWidth = computed(() => {
  if (cols >= 2) {
    return (width.value - (cols - 1) * Gap.value.col) / cols + 'px'
  }
  return '100%'
})
const Columns = ref<Array<{
  items: any[]
  height: number
}>>([])
// 初始化列
const initColumns = () => {
  Columns.value = Array.from({ length: cols }, () => ({
    items: [],
    height: 0,
  }))
}
// 获取最短的列
const getShortestColumn = () => {
  return Columns.value.reduce((prev, curr) =>
    prev.height <= curr.height ? prev : curr
  );
};
// 更新各列高度
const updateColumnHeights = (item: any, col: any) => {
  if (item._height_) {
    return col.height += (item._height_ + Gap.value.row)
  }
  const dom = document.createElement('div')
  dom.style.width = colWidth.value
  const temporary = createApp({
    render: () => h('div', {}, [slots.default!({ item })])
  })
  document.body.appendChild(dom)
  loadPlugins(temporary).mount(dom)
  const height = parseFloat(window.getComputedStyle(dom).height)
  item._height_ = height
  col.height += (height + Gap.value.row)
  temporary.unmount()
  dom.remove()
};
// 布局所有元素
const layout = async () => {
  // 清空现有列并重新初始化
  initColumns()
  // 遍历每个item，分配到对应的列中
  list.forEach((item) => {
    // 找到高度最小的列
    const shortestColumn = getShortestColumn();
    // 将item添加到对应的列中
    shortestColumn.items.push(item)
    // 更新列的高度
    updateColumnHeights(item, shortestColumn)
  })
}
// 处理每个item尺寸变化->重新布局
const handleResize = async (item: any, entries: readonly ResizeObserverEntry[]) => {
  const height = entries[0].contentRect.height
  if (!height || item._height_ === height) return
  // console.log(height, entries[0].target);
  await nextTick()
  item._height_ = height
  layout()
}
watchEffect(() => {
  if (list.length) {
    layout()
  }
})
</script>

<template>
  <div ref="container" class="waterfall">
    <div v-for="Column in Columns" class="waterfall-col">
      <div v-for="(item, index) in Column.items" :key="item.id" v-resize-observer="(e) => handleResize(item, e)"
        class="waterfall-item">
        <slot :item="item" :index="index" />
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.waterfall {
  display: flex;
  flex-wrap: wrap;
  column-gap: v-bind("Gap.col + 'px'");
  justify-content: space-between;
  width: 100%;

  &-col {
    height: fit-content;
    width: v-bind(colWidth);
  }

  &-item {
    width: 100%;
    margin-bottom: v-bind("Gap.row + 'px'");
  }
}
</style>
