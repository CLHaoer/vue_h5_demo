<script setup lang='ts'>
import { vElementSize } from '@vueuse/components'
const {gap = 0, list ,...props} = defineProps<{
  cols?: number
  colWidth?: number
  gap?:number
  list:any[]
}>()
const container = useTemplateRef<HTMLElement>('waterfallREf')
const { width } = useElementSize(container)
const Columns = ref<Array<{
  items: {id:string,img:string,desc:string}[]
  height: number
}>>([])
const colCount = computed(() => {
  if(props.cols) return props.cols
  if(props.colWidth) {
    return Math.floor(width.value / (props.colWidth + gap))
  }
  return 1
})
const colWidth = computed(() => {
  if(props.colWidth) return {width: `${props.colWidth}px`}
  if(props.cols) {
    return {width: `${(width.value - (props.cols - 1) * gap) / props.cols}px`}
  }
  return {width: `100%`}
})
const initColumns = () => {
  Columns.value = Array.from({ length: colCount.value }, () => ({
    items: [],
    height: 0,
  }))
}
const getItemHeight = ({width,height}:{width:number,height:number},item:any)=>{
  if(item.width && item.height) return
  // 计算item的高度并更新对应列的高度
  item.height = height
  item.width = width
  distributeItems()
}
const distributeItems = () => {
  if (!list.length) return
  // 清空现有列并重新初始化
  initColumns()
  // 遍历每个item，分配到对应的列中
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    // 找到高度最小的列
    const minColIndex = Columns.value.reduce((minIndex, col, index) => {
      return col.height < Columns.value[minIndex].height ? index : minIndex
    }, 0)
    // 将item添加到对应的列中
    Columns.value[minColIndex].items.push(item)
    // 更新列的高度
    Columns.value[minColIndex].height += item.height || 0
  }
}
// watchEffect(() => {
//   // 当list变化时，重新分配items
//   if (width.value) {
//     console.log('width',width.value);
//     distributeItems()
//   }
// })


onMounted(()=>{
  initColumns()
  distributeItems()
})



</script>

<template>
  <div ref="waterfallREf" class="waterfall">
    <div v-for="Column in Columns" :style="colWidth" class="waterfall-col">
      <div v-for="(item, index) in Column.items" v-element-size="el=> getItemHeight(el,item)" :key="item.id" class="waterfall-item">
        <slot :item="item" :index="index" />
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.waterfall {
  display: flex;
  flex-wrap: wrap;
  gap: v-bind("gap ? gap :0")px;
  justify-content: space-between;
  width: 100%;
}
</style>
