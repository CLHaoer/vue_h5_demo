<script setup lang="ts">
import qrWorker from './worker.ts?worker'
interface Props {
  // 是否显示扫码组件
  visible: boolean;
  // 扫描框宽度
  scanWidth?: number;
  // 扫描框高度
  scanHeight?: number;
  // 使用前置摄像头
  useFrontCamera?: boolean;
  // 自定义扫描区域样式
  scanAreaClass?: string;
  // 扫描频率（毫秒）
  scanFps?: number;
  // 是否显示错误提示
  showErrorToast?: boolean;
}

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'success', result: string): void;
  (e: 'error', error: Error): void;
  (e: 'cancel'): void;
  (e: 'scan-image-data', imageData: ImageData): void;
}

const props = withDefaults(defineProps<Props>(), {
  scanWidth: 300,
  scanHeight: 300,
  useFrontCamera: false,
  scanAreaClass: '',
  scanFps: 30, // 默认100ms扫描一次
  showErrorToast: false
})
const emit = defineEmits<Emits>()
const route = useRoute()
const stream = shallowRef<MediaStream | null>(null)
// 使用useTemplateRef代替传统ref获取DOM引用
const video = useTemplateRef<HTMLVideoElement>('video')
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const ctx = shallowRef<CanvasRenderingContext2D | null>(null)
const scanActive = ref(false)
const loadingCamera = ref(true)
const isVisible = ref(false)
const torchActive = ref(false)
const availableCameras = shallowRef<MediaDeviceInfo[]>([])
const selectedCamera = ref('')
const animationFrameId = ref<number | null>()
const Worker = new qrWorker()

watch(() => props.visible, async (val) => {
  if (await checkCameraPermission()) {
    isVisible.value = val
  }
})
watch(() => isVisible.value, (val) => {
  emit('update:visible', val)
  if (val) {
    initScan()
  } else {
    stopScan()
  }
})

// 检测可用相机列表
const getCameraList = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    availableCameras.value = devices.filter(device => device.kind === 'videoinput')
    if (availableCameras.value.length) return
    // 优先选择后置摄像头
    if (!props.useFrontCamera) {
      const backCamera = availableCameras.value.find(camera =>
        camera.label.toLowerCase().includes('back') ||
        camera.label.toLowerCase().includes('环境') ||
        camera.label.toLowerCase().includes('后置')
      )
      if (backCamera) {
        selectedCamera.value = backCamera.deviceId
      } else {
        selectedCamera.value = availableCameras.value[0].deviceId
      }
    } else {
      // 寻找前置摄像头
      const frontCamera = availableCameras.value.find(camera =>
        camera.label.toLowerCase().includes('front') ||
        camera.label.toLowerCase().includes('用户') ||
        camera.label.toLowerCase().includes('前置')
      )
      if (frontCamera) {
        selectedCamera.value = frontCamera.deviceId
      } else {
        selectedCamera.value = availableCameras.value[0].deviceId
      }
    }
  } catch (error) {
    emit('error', error as Error)
  }
}

// 切换摄像头
const switchCamera = async () => {
  if (availableCameras.value.length <= 1) return

  const currentIndex = availableCameras.value.findIndex(camera => camera.deviceId === selectedCamera.value)
  const nextIndex = (currentIndex + 1) % availableCameras.value.length
  selectedCamera.value = availableCameras.value[nextIndex].deviceId

  // 关闭当前摄像头流
  stopMediaStream()
  // 使用新选择的摄像头启动
  await startScan()
}

// 开启/关闭手电筒
const toggleTorch = async () => {
  if (!stream.value) return

  const track = stream.value.getVideoTracks()[0]
  try {
    // 使用any类型绕过TypeScript类型检查
    const capabilities = track.getCapabilities() as any
    if (!capabilities.torch) return

    torchActive.value = !torchActive.value
    await track.applyConstraints({
      // 使用any类型绕过TypeScript类型检查
      advanced: [{ torch: torchActive.value } as any]
    })
  } catch (error) {
    console.error('切换手电筒失败:', error)
  }
}

// 开始扫描
const startScan = async () => {
  loadingCamera.value = true
  scanActive.value = true

  try {
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: {
        facingMode: props.useFrontCamera ? 'user' : 'environment',
      }
    }
    // 如果选择了特定摄像头，使用deviceId
    if (selectedCamera.value) {
      (constraints.video as MediaTrackConstraints).deviceId = selectedCamera.value
    }

    const _stream = await navigator.mediaDevices.getUserMedia(constraints)
    stream.value = _stream
    if (video.value) {
      video.value.srcObject = _stream
      await video.value.play()
      // 尝试使用原生 BarcodeDetector API，如果支持的话
      if ('BarcodeDetector' in window) {
        startBarcodeDetection()
      } else {
        // 否则使用 jsQR 库进行处理
        startJsQrScanning()
      }
    }

    loadingCamera.value = false
  } catch (error) {
    scanActive.value = false
    loadingCamera.value = false
    emit('error', error as Error)
    console.error('启动摄像头失败:', error)
  }
}

// 使用原生BarcodeDetector API
const startBarcodeDetection = async () => {
  try {
    // 使用any类型绕过TypeScript类型检查
    const BarcodeDetector = (window as any).BarcodeDetector
    const formats = await BarcodeDetector.getSupportedFormats()

    // 检查是否支持二维码格式
    if (!formats.includes('qr_code')) {
      console.warn('BarcodeDetector 不支持二维码格式，降级到 jsQR')
      startJsQrScanning()
      return
    }

    const barcodeDetector = new BarcodeDetector({
      formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'upc_a', 'upc_e']
    })

    const detectBarcode = async () => {
      if (!scanActive.value || !video.value) return

      try {
        const barcodes = await barcodeDetector.detect(video.value)
        if (barcodes.length > 0) {
          stopScan()
          emit('success', barcodes[0].rawValue)
          return
        }
      } catch (error) {
        console.error('条码检测失败:', error)
      }

      // 继续检测
      if (scanActive.value) {
        requestAnimationFrame(detectBarcode)
      }
    }

    detectBarcode()
  } catch (error) {
    console.error('BarcodeDetector初始化失败，降级到jsQR:', error)
    startJsQrScanning()
  }
}

// 使用jsQR库扫描
function startJsQrScanning() {
  if (!scanActive.value || !ctx.value || !video.value) return;
  let lastFrameTime = 0;
  let fpsInterval = 1000 / props.scanFps;
  const processFrame = () => {
    if (!scanActive.value) return
    // Fps
    const now = Date.now();
    const elapsed = now - lastFrameTime;

    if (elapsed < fpsInterval) {
      animationFrameId.value = requestAnimationFrame(processFrame)
      return
    }

    const { videoWidth, videoHeight } = video.value!;
    const scanLeft = (videoWidth - props.scanWidth) / 2;
    const scanTop = (videoHeight - props.scanHeight) / 2;
    ctx.value!.drawImage(video.value!, scanLeft, scanTop, props.scanWidth, props.scanHeight,
      0, 0, props.scanWidth, props.scanHeight);
    const imageData = ctx.value!.getImageData(0, 0, props.scanWidth, props.scanHeight);
    Worker.postMessage({ imageData, }, [imageData.data.buffer])
    Worker.onmessage = (event: MessageEvent) => {
      const { error, data } = event.data
      if (data) {
        console.log('识别到二维码：', data);
        stopScan()
        emit('success', data)
      }
    }
    lastFrameTime = now
    animationFrameId.value = requestAnimationFrame(processFrame)
  }
  animationFrameId.value = requestAnimationFrame(processFrame)
}

// 停止扫描
const stopScan = () => {
  scanActive.value = false
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
  stopMediaStream()
}

// 停止媒体流
const stopMediaStream = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  if (video.value) {
    video.value.srcObject = null
  }
}

// 取消扫描
const cancel = () => {
  stopScan()
  isVisible.value = false
  emit('cancel')
}

// 初始化canvas上下文
const initCanvas = () => {
  if (canvas.value) {
    // 添加willReadFrequently属性，优化频繁读取图像数据的性能
    ctx.value = canvas.value.getContext('2d', { willReadFrequently: true })
    canvas.value.width = props.scanWidth
    canvas.value.height = props.scanHeight
  }
}

// 检测摄像头权限
const checkCameraPermission = async () => {
  const { state } = await navigator.permissions.query({ name: 'camera' as any })
  if (state === 'granted') return true
  try {
    // 获取一次媒体流来检查权限
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    // 立即停止流
    mediaStream.getTracks().forEach(track => track.stop())
    return true
  } catch (error) {
    emit('error', new Error('没有获得相机访问权限'))
    return false
  }
}

// 初始化扫描
const initScan = async () => {
  if (isVisible.value) {
    const hasPermission = await checkCameraPermission()
    if (hasPermission) {
      console.time('getCameraList');
      await getCameraList()
      console.timeEnd('getCameraList');
      console.time('initCanvas');
      initCanvas()
      console.timeEnd('initCanvas');
      console.time('startScan');
      await startScan()
    } else isVisible.value = false
  }
}


// 显示扫码组件
const show = async () => {
  isVisible.value = await checkCameraPermission()
}

// 隐藏扫码组件
const hide = () => {
  isVisible.value = false
}

// 路由变更时停止
watch(() => route.path, cancel)

// 组件挂载时
onMounted(() => {
  if (isVisible.value) {
    initScan()
  }
})

// 组件卸载时
onUnmounted(() => {
  Worker.terminate()
  stopScan()
  stopMediaStream()
})

// 向外暴露方法
defineExpose({
  show,
  hide
})
</script>

<template>
  <van-popup v-model:show="isVisible" position="bottom" :style="{ height: '100%' }" @close="cancel">
    <div class="qr-scanner">
      <!-- 相机预览 -->
      <div class="video-container">
        <video ref="video" autoplay playsinline muted></video>
        <canvas ref="canvas" class="hidden-canvas"></canvas>

        <!-- 扫描框 -->
        <div class="scan-area" :class="scanAreaClass" :style="{ width: `${scanWidth}px`, height: `${scanHeight}px` }">
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
          <div class="scan-line" v-if="scanActive && !loadingCamera"></div>
        </div>

        <!-- 加载指示器 -->
        <div class="loading-container" v-if="loadingCamera">
          <van-loading type="spinner" size="40px" color="#fff" />
          <div class="loading-text">正在启动相机...</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <!-- 切换摄像头按钮 -->
        <van-button v-if="availableCameras.length > 1" class="action-button" round plain icon="photograph" size="small"
          @click="switchCamera">
          切换相机
        </van-button>

        <!-- 手电筒按钮 -->
        <van-button class="action-button" round plain :icon="torchActive ? 'bulb' : 'bulb-o'" size="small"
          @click="toggleTorch">
          {{ torchActive ? '关闭手电筒' : '打开手电筒' }}
        </van-button>

        <!-- 取消按钮 -->
        <van-button class="action-button" round type="danger" plain icon="cross" size="small" @click="cancel">
          取消
        </van-button>
      </div>

      <!-- 扫描提示 -->
      <div class="scan-tip">
        请将二维码/条码放入框内，即可自动扫描
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.qr-scanner {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #000;
  color: #fff;
  overflow: hidden;
}

.video-container {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

video {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hidden-canvas {
  display: none;
}

.scan-area {
  position: absolute;
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  z-index: 10;

  .corner {
    position: absolute;
    width: 30px;
    height: 30px;
    border-color: #1989fa;
    border-style: solid;
    border-width: 0;
  }

  .top-left {
    top: 0;
    left: 0;
    border-top-width: 4px;
    border-left-width: 4px;
    border-top-left-radius: 12px;
  }

  .top-right {
    top: 0;
    right: 0;
    border-top-width: 4px;
    border-right-width: 4px;
    border-top-right-radius: 12px;
  }

  .bottom-left {
    bottom: 0;
    left: 0;
    border-bottom-width: 4px;
    border-left-width: 4px;
    border-bottom-left-radius: 12px;
  }

  .bottom-right {
    bottom: 0;
    right: 0;
    border-bottom-width: 4px;
    border-right-width: 4px;
    border-bottom-right-radius: 12px;
  }

  .scan-line {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 4px;
    background: linear-gradient(to right, transparent, #1989fa, transparent);
    animation: scan 1.5s linear infinite;
    z-index: 11;
  }
}

.loading-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 12;

  .loading-text {
    margin-top: 16px;
    font-size: 16px;
    color: #fff;
  }
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  background-color: #222;
  z-index: 10;

  .action-button {
    margin: 0 8px;
  }
}

.scan-tip {
  padding: 12px 16px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  background-color: #222;
}

@keyframes scan {
  0% {
    top: 0;
  }

  50% {
    top: calc(100% - 4px);
  }

  100% {
    top: 0;
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .action-buttons {
    background-color: #111;
  }

  .scan-tip {
    background-color: #111;
  }
}
</style>