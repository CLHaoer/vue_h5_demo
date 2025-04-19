declare module 'vconsole' {
  interface VConsoleOptions {
    defaultPlugins?: string[]
    theme?: 'light' | 'dark'
    disableLogScrolling?: boolean
    maxLogNumber?: number
    onReady?: () => void
    target?: HTMLElement
  }

  class VConsole {
    constructor(options?: VConsoleOptions)
    setOption(options: VConsoleOptions): void
    destroy(): void
    show(): void
    hide(): void
    showTab(pluginId: string): void
    isShown(): boolean
  }

  export default VConsole
} 