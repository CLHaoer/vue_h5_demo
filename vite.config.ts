import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports:[
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core'
      ],
      resolvers: [VantResolver()],
      dts: 'src/typings/auto-import.d.ts'
    }),
    Components({
      dirs: ['src/components/**', 'src/layout/**'], // 设置需要扫描的目录
      resolvers: [VantResolver()],
      dts: 'src/typings/components.d.ts'
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    // css预处理
    preprocessorOptions: {
      scss: {
        // 使用 @use 语法代替 @import
        additionalData: '@use "@/assets/styles/variables.scss" as *;',
      },
    },
  },
})
