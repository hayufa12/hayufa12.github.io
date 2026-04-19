/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:      '#1a1a2e',
        'navy-2':  '#252540',
        'bg-2':    '#f8f9ff',
        'bg-3':    '#eef0f8',
        border:    '#e2e5f0',
        'border-2':'#c5cce0',
        text2:     '#4a5568',
        text3:     '#718096',
        accent:    '#22c55e',
        'navy-dark': '#13132a',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

