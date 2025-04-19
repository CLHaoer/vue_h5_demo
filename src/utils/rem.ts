// rem 适配函数
export default function setRem(): void {
  const baseSize = 37.5; // 基准值，与postcss-pxtorem的rootValue保持一致
  const scale = document.documentElement.clientWidth / 375; // 计算scale（设计稿以375px宽度为基准）
  
  // 设置页面根字体大小
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 1.5) + 'px';
  // 设置页面最大宽度
  const maxWidth = baseSize * Math.min(scale, 1.5) * 10; // 设置最大宽度为540px
  if (document.documentElement.clientWidth > maxWidth) {
    document.documentElement.style.width = maxWidth + 'px';
    document.documentElement.style.margin = '0 auto';
  } else {
    document.documentElement.style.width = '100%';
    document.documentElement.style.margin = '0';
  }
}

// 初始化
setRem();
// 改变窗口大小时重新设置rem
window.addEventListener('resize', setRem);
// 页面显示/切换 时重新计算
window.addEventListener('pageshow', (e: PageTransitionEvent) => {
  if (e.persisted) {
    setRem();
  }
}); 