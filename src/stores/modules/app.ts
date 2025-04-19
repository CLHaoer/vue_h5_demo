import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface AppTheme {
  primary: string
  success: string
  warning: string
  danger: string
  background: string
  textPrimary: string
  textSecondary: string
}

export const useAppStore = defineStore('app', () => {
  // 暗色模式
  const isDarkMode = ref(false)

  // 切换深色模式
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // 当前主题色
  const theme = computed<AppTheme>(() => ({
    primary: isDarkMode.value ? '#177DDC' : '#1989fa',
    success: isDarkMode.value ? '#49AA19' : '#07c160',
    warning: isDarkMode.value ? '#D89614' : '#ff976a',
    danger: isDarkMode.value ? '#D32029' : '#ee0a24',
    background: isDarkMode.value ? '#1C1C1E' : '#f7f8fa',
    textPrimary: isDarkMode.value ? '#F6F6F6' : '#323233',
    textSecondary: isDarkMode.value ? '#A3A3A3' : '#969799'
  }))

  // 语言
  const language = ref('zh-CN')

  // 设置语言
  const setLanguage = (lang: string) => {
    language.value = lang
  }

  // 应用初始化
  const init = () => {
    // 检测系统暗色模式
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkMode.value = prefersDark
    applyTheme()
  }

  return {
    isDarkMode,
    toggleDarkMode,
    theme,
    language,
    setLanguage,
    init
  }
}, {
  persist: true
}) 