import { createApp, h, type App } from 'vue'
import ScanQrCode from './ScanQrCode.vue'
import router from '@/router'

// 扫码配置选项接口
export interface ScanOptions {
  scanWidth?: number
  scanHeight?: number
  useFrontCamera?: boolean
  scanAreaClass?: string
  scanFps?: number
  onSuccess?: (result: string) => void
  onError?: (error: Error) => void
  onCancel?: () => void
  showErrorToast?: boolean
}

// 扫码实例接口
interface QrCodeInstance {
  show: () => void
  hide: () => void
  destroy: () => void
}

// 默认配置
const defaultOptions: ScanOptions = {
  scanWidth: 300,
  scanHeight: 300,
  useFrontCamera: false,
  scanAreaClass: '',
  scanFps: 30,
  showErrorToast: true
}

// 当前扫码实例
let currentInstance: QrCodeInstance | null = null

/**
 * 创建扫码组件实例
 * @param options 扫码配置选项
 * @returns 扫码实例对象，包含show、hide和destroy方法
 */
function createScanQrInstance(options: ScanOptions = {}): QrCodeInstance {
  // 合并配置
  const mergedOptions = { ...defaultOptions, ...options }
  
  // 创建一个容器元素
  const container = document.createElement('div')
  document.body.appendChild(container)
  
  // 创建扫码组件实例
  const instance = createApp({
    setup() {
      const visible = ref(false)
      
      // 成功扫描回调
      const handleSuccess = (result: string) => {
        visible.value = false
        mergedOptions.onSuccess?.(result)
      }
      
      // 扫描错误回调
      const handleError = (error: Error) => {
        // 显示错误提示
        if (mergedOptions.showErrorToast) {
          showToast({
            message: error.message || '扫码出错',
            type: 'fail',
            position: 'middle'
          })
        }
        mergedOptions.onError?.(error)
      }
      
      // 取消扫描回调
      const handleCancel = () => {
        visible.value = false
        mergedOptions.onCancel?.()
      }
      
      return () => h(ScanQrCode, {
        visible: visible.value,
        'onUpdate:visible': (val: boolean) => visible.value = val,
        scanWidth: mergedOptions.scanWidth,
        scanHeight: mergedOptions.scanHeight,
        useFrontCamera: mergedOptions.useFrontCamera,
        scanAreaClass: mergedOptions.scanAreaClass,
        scanFps: mergedOptions.scanFps,
        onSuccess: handleSuccess,
        onError: handleError,
        onCancel: handleCancel,
        ref: 'scanQrCode'
      })
    }
  })
  
  // 挂载实例
  const appInstance = instance.use(router).mount(container)
  
  // 创建控制方法
  const qrInstance: QrCodeInstance = {
    // 显示扫码组件
    show: () => {
      // 如果已有实例，先销毁
      if (currentInstance && currentInstance !== qrInstance) {
        currentInstance.destroy()
      }
      
      // 获取暴露的组件实例方法
      const componentInstance = (appInstance as any).$refs.scanQrCode
      if (componentInstance && typeof componentInstance.show === 'function') {
        componentInstance.show()
      } else {
        // 如果无法获取组件实例方法，则直接设置可见性
        (appInstance as any).visible = true
      }
      
      // 记录当前实例
      currentInstance = qrInstance
    },
    
    // 隐藏扫码组件
    hide: () => {
      const componentInstance = (appInstance as any).$refs.scanQrCode
      if (componentInstance && typeof componentInstance.hide === 'function') {
        componentInstance.hide()
      } else {
        // 如果无法获取组件实例方法，则直接设置可见性
        (appInstance as any).visible = false
      }
    },
    
    // 销毁组件实例
    destroy: () => {
      try {
        instance.unmount()
        container.remove()
      } catch (error) {
        console.error('销毁扫码组件实例失败:', error)
      } finally {
        if (currentInstance === qrInstance) {
          currentInstance = null
        }
      }
    }
  }
  
  return qrInstance
}

/**
 * 显示扫码组件并返回结果
 * @param options 扫码配置选项
 * @returns Promise，成功返回扫码结果，失败或取消返回对应错误
 */
const showQrScanner = function(options: ScanOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    let destroyed = false
    
    const instance = createScanQrInstance({
      ...options,
      onSuccess: (result) => {
        if (destroyed) return
        
        // 避免重复调用
        destroyed = true
        
        // 先调用传入的回调
        options.onSuccess?.(result)
        
        // 延迟销毁组件，确保动画完成
        setTimeout(() => {
          instance.destroy()
        }, 200)
        
        // 解析Promise
        resolve(result)
      },
      onError: (error) => {
        if (destroyed) return
        
        // 先调用传入的回调
        options.onError?.(error)
        
        // 对于某些严重错误（如权限被拒绝），自动销毁实例
        const criticalErrors = [
          '相机权限被拒绝',
          '未检测到可用的相机设备',
          '浏览器不支持访问相机'
        ]
        
        if (criticalErrors.some(msg => error.message.includes(msg))) {
          destroyed = true
          setTimeout(() => {
            instance.destroy()
          }, 200)
          reject(error)
        }
      },
      onCancel: () => {
        if (destroyed) return
        
        // 避免重复调用
        destroyed = true
        
        // 先调用传入的回调
        options.onCancel?.()
        
        // 延迟销毁组件，确保动画完成
        setTimeout(() => {
          instance.destroy()
        }, 200)
        
        // 拒绝Promise
        reject(new Error('用户取消扫码'))
      }
    })
    
    // 显示扫码组件
    instance.show()
  })
}

// 默认导出插件对象
const ScanQrCodePlugin = {
  install(app: App) {
    // 在Vue实例上挂载方法
    app.config.globalProperties.$scanQrCode = showQrScanner
    
    // 注册组件
    app.component('ScanQrCode', ScanQrCode)
  }
}

export default ScanQrCodePlugin

// 导出组件和服务方法
export { ScanQrCode, showQrScanner as scanQrCode }
