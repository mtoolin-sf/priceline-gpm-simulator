export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        priceline: {
          pink: '#E8005C',
          'pink-dark': '#B8004A',
          'pink-light': '#FFE0ED',
          dark: '#1A1A1A',
          gray: '#F9F4F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: []
}
