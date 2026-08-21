export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F2647',
          800: '#16345C',
          700: '#1E4478',
          600: '#2A5B99',
          500: '#3B72B4',
        },
        sky: {
          50: '#F3F8FD',
          100: '#E4EFFA',
          200: '#CFE2F5',
          300: '#B4D0EC',
          400: '#8FB6DF',
        },
        amber: {
          accent: '#E08A1E',
          soft: '#FDEFD6',
          deep: '#B96A0C',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px', '13px'],
      },
      boxShadow: {
        ribbon: '0 1px 0 rgba(255,255,255,0.7) inset, 0 1px 2px rgba(15,38,71,0.12)',
        dialog: '0 12px 40px rgba(15,38,71,0.35)',
      },
    },
  },
}
