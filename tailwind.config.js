/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0a0b0e',
          900: '#111318',
          800: '#1a1d24',
          700: '#22262f',
          600: '#2e3340',
          500: '#3d4455',
          400: '#56607a',
          300: '#8892a4',
          200: '#b8c0cf',
          100: '#e8eaf0',
          50:  '#f5f6f8',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'pulse-slow':  'pulse 4s ease-in-out infinite',
        'slide-up':    'slideUp 0.5s ease-out',
        'fade-in':     'fadeIn 0.6s ease-out',
        'glow':        'glow 2s ease-in-out infinite alternate',
        'scan':        'scan 8s linear infinite',
      },
      keyframes: {
        float:   { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        glow:    { from: { boxShadow: '0 0 8px rgba(251,191,36,0.3)' }, to: { boxShadow: '0 0 24px rgba(251,191,36,0.6)' } },
        scan:    { '0%': { backgroundPosition: '0 -100vh' }, '100%': { backgroundPosition: '0 100vh' } },
      },
      backgroundImage: {
        'grid-amber': `linear-gradient(rgba(251,191,36,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.04) 1px, transparent 1px)`,
        'grid-teal':  `linear-gradient(rgba(45,212,191,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
