import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        fast: '100ms',
        slow: '500ms',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}

export default config
