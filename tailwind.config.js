export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#3D0512',
          800: '#5C061B',
          700: '#7A1230',
          600: '#96253F',
          500: '#B23A52',
          400: '#C85F73',
          300: '#DDA0AC',
          200: '#EFCDD3',
        },
        sky: {
          50: '#FDFBF7',
          100: '#FAF7F0',
          200: '#F3EDDF',
          300: '#EAE0C8',
          400: '#DCC98F',
          500: '#D4AF37',
        },
        amber: {
          accent: '#D4AF37',
          soft: '#F5E9C4',
          deep: '#A8841F',
        },
        charcoal: '#1E1C1A',
        estado: {
          error: '#A32218',
          errorBg: '#FBEDEB',
          aviso: '#9C6206',
          avisoBg: '#FCF3E4',
          exito: '#2E6B4F',
          exitoBg: '#EAF3EE',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px', '13px'],
      },
      boxShadow: {
        ribbon: '0 1px 0 rgba(255,255,255,0.7) inset, 0 1px 2px rgba(92,6,27,0.12)',
        dialog: '0 12px 40px rgba(92,6,27,0.35)',
      },
    },
  },
}
