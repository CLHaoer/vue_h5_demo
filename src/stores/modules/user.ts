import { defineStore } from 'pinia'
import { ref } from 'vue'
import { showToast } from 'vant'

export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar: string
  phone: string
  token: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>({
    id: 'ID-5sg63s876745xhugfs',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    nickname: '用户昵称',
    username: 'claoer',
    phone: '138****1234',
    token: 'sdfasdf-asdf-gsdag223423-1234sd'
  })
  const isLogin = ref<boolean>(false)

  // actions
  const setToken = (value: string) => {
    token.value = value
    isLogin.value = !!value
  }

  const setUserInfo = (info: UserInfo | null) => {
    userInfo.value = info
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    isLogin.value = false
    showToast('已退出登录')
  }

  // 模拟登录
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 这里应该调用实际的登录 API
      // 此处仅做演示
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟返回数据
      const mockUserInfo: UserInfo = {
        id: '1',
        username,
        nickname: '测试用户',
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        phone: '138****1234',
        token: 'mock-token-12345'
      }
      
      // 设置 token 和用户信息
      setToken(mockUserInfo.token)
      setUserInfo(mockUserInfo)
      
      return true
    } catch (error) {
      console.error('登录失败', error)
      return false
    }
  }

  return {
    token,
    userInfo,
    isLogin,
    setToken,
    setUserInfo,
    login,
    logout
  }
}, {
  persist: true
}) 