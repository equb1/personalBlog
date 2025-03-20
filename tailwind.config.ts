module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        'material': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      colors: {
        primary: '#2563eb',
        'custom-beige': '#FFE8D6', // 自定义颜色名称和值
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      keyframes: {
        'dropdown-open': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'dropdown': 'dropdown-open 0.2s ease-out'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function ({ addComponents }: any) {
      addComponents({
        '.nav-hover-effect': {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            width: 'calc(100% - 20px)',
            height: '70%',
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: -1,
          },
          '&:hover::before': {
            transform: 'translate(-50%, -50%) scale(0.9)',
            borderRadius: '16px',
          }
        }
      });
    }
  ],
  darkMode: 'class', // 确保这里设置为 'class' 模式
};