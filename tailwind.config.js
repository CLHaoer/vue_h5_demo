/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 自定义颜色
      colors: {
        primary: '#1989fa',
        success: '#07c160',
        warning: '#ff976a',
        danger: '#ee0a24',
      },
      // 自定义间距，使用 rem 单位
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem',
      },
      // 自定义字体大小，使用 rem 单位
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      // 自定义边框圆角，使用 rem 单位
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'md': '0.25rem',
        'lg': '0.5rem',
        'full': '9999px',
      },
    },
  },
  // 匹配 Vant 的设计规范，使用的单位是 rem
  corePlugins: {
    preflight: false, // 禁用默认样式重置，避免与 Vant 冲突
  },
  plugins: [],
} 