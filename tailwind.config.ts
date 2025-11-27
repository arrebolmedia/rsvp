import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        foreground: '#2B2B2B',
        'accent-terracotta': '#C67B5C',
        'accent-blush': '#E8C4B8',
        'accent-wine': '#8B5A6F',
        'border-subtle': '#E8E3DD',
        primary: {
          50: '#FAF8F5',
          100: '#f2e8e5',
          200: '#E8E3DD',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#C67B5C',
          600: '#8B5A6F',
          700: '#977669',
          800: '#846358',
          900: '#2B2B2B',
        },
        gold: {
          400: '#d4af37',
          500: '#C67B5C',
          600: '#8B5A6F',
        }
      },
      fontFamily: {
        serif: ['benton-modern-display', 'Playfair Display', 'Georgia', 'serif'],
        elegant: ['benton-modern-display', 'Playfair Display', 'Georgia', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
