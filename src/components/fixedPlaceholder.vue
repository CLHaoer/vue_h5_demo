<script setup lang="ts">
const fxpRef = useTemplateRef('fxp')
const placeholderStyle = computed(() => {
  // 获取第一个子节点的高度，包括border、padding、margin
  const firstChild = fxpRef.value?.firstElementChild
  if (!firstChild || firstChild?.id === 'placeholder') return {}

  // 获取元素的完整高度
  const styles = window.getComputedStyle(firstChild)
  const marginTop = parseFloat(styles.marginTop)
  const marginBottom = parseFloat(styles.marginBottom)

  // 元素的完整高度 = 内容高度 + padding + border + margin
  const totalHeight = (firstChild as HTMLElement).offsetHeight + marginTop + marginBottom

  return {
    height: `${totalHeight}px`
  }
})

</script>
<template>
  <div ref="fxp" :style="placeholderStyle">
    <slot></slot>
    <!-- <div id="placeholder" ></div> -->
  </div>
</template>
<style scoped lang="scss"></style>