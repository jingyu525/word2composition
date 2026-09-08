import type { Config } from 'tailwindcss'

/**
 * Tailwind 配置 — 新鲜感词语库绘本风
 * 详见 CLAUDE.md §11
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF9F45', // 暖橙（主操作 / 强调）
        secondary: '#4ECDC4', // 薄荷绿（成功 / 完成）
        accent: '#FFD93D', // 阳光黄（高亮 / 星星）
        deep: '#5B5F97', // 静谧紫（标题）
        pink: '#FF6B9D', // 樱花粉（点缀）
        sky: '#95E1D3', // 天空蓝（次级按钮）
        bg: '#FFF9F0', // 米白底（绘本纸感）
        'bg-soft': '#FFF3E0', // 浅米卡底
      },
      fontSize: {
        // 比常规大 20%（8 岁孩子友好）
        md: ['18px', '28px'], // 输入框
        lg: ['22px', '32px'], // chip
        xl: ['28px', '36px'], // 步骤标题
        '2xl': ['36px', '44px'], // 大标题
        '3xl': ['48px', '56px'], // 完成弹窗大字
      },
      borderRadius: {
        // 绘本大圆角
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      boxShadow: {
        soft: '0 4px 16px rgba(91, 95, 151, 0.15)',
        pop: '0 8px 32px rgba(91, 95, 151, 0.20)',
      },
      fontFamily: {
        sans: [
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'system-ui',
          'sans-serif',
        ],
      },
      minHeight: {
        // 触摸区 ≥ 44px
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
} satisfies Config