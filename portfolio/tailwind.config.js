/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        paper: '#f2f2f0',
        accent: '#4f7cff',
        'accent-soft': 'rgba(79, 124, 255, 0.55)',
        fog: 'rgba(242, 242, 240, 0.55)',
        dim: 'rgba(242, 242, 240, 0.32)',
        hairline: 'rgba(242, 242, 240, 0.12)',
      },
      fontFamily: {
        sans: ['"Neue Montreal"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"SFMono-Regular"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(rgba(242,242,240,0.07) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
