/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#FF2E63',
        'primary-light': '#FF6B6B',
        'primary-dark': '#C41E3A',
        'secondary': '#00ADB5',
        'secondary-light': '#08D9D6',
        'secondary-dark': '#007A7E',
        'bg-dark': '#121418',
        'bg-base': '#1A1D24',
        'bg-light': '#252A34',
        'surface-dark': '#16181D',
        'surface': '#1E2228',
        'surface-light': '#2D3239',
        'text-primary': '#EAEAEA',
        'text-secondary': '#B2B2B2',
        'text-muted': '#666666'
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem'
      },
      fontSize: {
        'xxs': '0.625rem',
        'md': '1.075rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 15px rgba(255, 46, 99, 0.3)',
        'neon': '0 0 20px rgba(8, 217, 214, 0.3)'
      }
    },
  },
  plugins: [],
}

