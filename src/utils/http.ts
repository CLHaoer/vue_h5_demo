import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, CancelToken, Canceler } from 'axios'
import { showToast } from 'vant'

// 自定义映射结构
interface PendingRequest {
  token: CancelToken;
  cancel: Canceler;
}

// 存储请求的映射表（用于取消重复请求）
const pendingRequests = new Map<string, PendingRequest>()

// 生成请求标识
const generateRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 添加请求到映射表
const addPendingRequest = (config: AxiosRequestConfig): void => {
  const requestKey = generateRequestKey(config)
  const source = axios.CancelToken.source()
  config.cancelToken = config.cancelToken || source.token
  
  if (!pendingRequests.has(requestKey)) {
    pendingRequests.set(requestKey, {
      token: source.token,
      cancel: source.cancel
    })
  }
}

// 移除请求从映射表
const removePendingRequest = (config: AxiosRequestConfig): void => {
  const requestKey = generateRequestKey(config)
  if (pendingRequests.has(requestKey)) {
    pendingRequests.delete(requestKey)
  }
}

// 取消重复请求
const cancelPendingRequest = (config: AxiosRequestConfig): void => {
  const requestKey = generateRequestKey(config)
  if (pendingRequests.has(requestKey)) {
    const { cancel } = pendingRequests.get(requestKey)!
    cancel(`重复请求被取消: ${requestKey}`)
    pendingRequests.delete(requestKey)
  }
}

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 取消之前的重复请求
    cancelPendingRequest(config)
    // 将当前请求添加到映射表
    addPendingRequest(config)
    
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 移除已完成的请求
    removePendingRequest(response.config)
    
    const { code, message, data } = response.data
    
    // 根据后端接口规范调整
    if (code === 200) {
      return data
    } else {
      showToast({
        message: message || '请求失败',
        type: 'fail'
      })
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  (error) => {
    // 移除失败的请求
    if (error.config) {
      removePendingRequest(error.config)
    }
    
    // 请求被取消的情况
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message)
      return Promise.reject(error)
    }
    
    // 处理 HTTP 网络错误
    let message = ''
    const status = error.response?.status
    switch (status) {
      case 401:
        message = '未授权，请重新登录'
        // 可以在这里处理登出逻辑
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器故障'
        break
      default:
        message = '网络连接故障'
    }
    showToast({
      message,
      type: 'fail'
    })
    return Promise.reject(error)
  }
)

// 自动重试配置
interface RetryConfig {
  retryCount: number
  retryDelay: number
}

/**
 * 使用自动重试功能的请求
 * @param config 请求配置
 * @param retryConfig 重试配置
 */
const requestWithRetry = async <T>(
  config: AxiosRequestConfig,
  retryConfig: RetryConfig = { retryCount: 3, retryDelay: 1000 }
): Promise<T> => {
  const { retryCount, retryDelay } = retryConfig
  let currentRetry = 0
  
  const executeRequest = async (): Promise<T> => {
    try {
      return await http.request<any, T>(config)
    } catch (error: any) {
      // 如果是取消请求、401、403 等状态，不再重试
      if (
        axios.isCancel(error) ||
        (error.response && [401, 403].includes(error.response.status)) ||
        currentRetry >= retryCount
      ) {
        throw error
      }
      
      // 增加重试次数
      currentRetry++
      console.log(`请求失败，第 ${currentRetry} 次重试...`)
      
      // 延迟执行重试
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      
      // 重试请求
      return executeRequest()
    }
  }
  
  return executeRequest()
}

// 封装 GET 请求
export const get = <T>(
  url: string,
  params?: object,
  config?: AxiosRequestConfig,
  retry?: RetryConfig
): Promise<T> => {
  if (retry) {
    return requestWithRetry<T>({
      method: 'get',
      url,
      params,
      ...config
    }, retry)
  }
  return http.get(url, { params, ...config })
}

// 封装 POST 请求
export const post = <T>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig,
  retry?: RetryConfig
): Promise<T> => {
  if (retry) {
    return requestWithRetry<T>({
      method: 'post',
      url,
      data,
      ...config
    }, retry)
  }
  return http.post(url, data, config)
}

// 封装 PUT 请求
export const put = <T>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig,
  retry?: RetryConfig
): Promise<T> => {
  if (retry) {
    return requestWithRetry<T>({
      method: 'put',
      url,
      data,
      ...config
    }, retry)
  }
  return http.put(url, data, config)
}

// 封装 DELETE 请求
export const del = <T>(
  url: string,
  config?: AxiosRequestConfig,
  retry?: RetryConfig
): Promise<T> => {
  if (retry) {
    return requestWithRetry<T>({
      method: 'delete',
      url,
      ...config
    }, retry)
  }
  return http.delete(url, config)
}

// 取消所有请求
export const cancelAllRequests = (): void => {
  pendingRequests.forEach(({ cancel }) => {
    cancel('用户取消了所有请求')
  })
  pendingRequests.clear()
}

export default http 