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
        // Usar CSS variables que se actualizan dinámicamente
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'accent-terracotta': 'var(--accent-terracotta)',
        'accent-blush': 'var(--accent-blush)',
        'accent-wine': 'var(--accent-wine)',
        'border-subtle': 'var(--border-subtle)',
        primary: {
          50: 'var(--background)',
          100: 'color-mix(in srgb, var(--accent-blush) 50%, white)',
          200: 'var(--border-subtle)',
          300: 'color-mix(in srgb, var(--accent-blush) 70%, white)',
          400: 'color-mix(in srgb, var(--accent-terracotta) 70%, white)',
          500: 'var(--accent-terracotta)',
          600: 'var(--accent-wine)',
          700: 'color-mix(in srgb, var(--accent-wine) 80%, black)',
          800: 'color-mix(in srgb, var(--accent-wine) 60%, black)',
          900: 'var(--foreground)',
        },
        gold: {
          400: 'var(--accent-blush)',
          500: 'var(--accent-terracotta)',
          600: 'var(--accent-wine)',
        }
      },
      fontFamily: {
        serif: ['var(--font-heading)', 'serif'],
        elegant: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
