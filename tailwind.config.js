/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#0a0c0f',
          panel: '#0e1117',
          border: '#1a2030',
          green: '#00ff88',
          'green-dim': '#00cc6a',
          'green-muted': '#004d2a',
          'green-glow': '#00ff8833',
          amber: '#ffb800',
          'amber-dim': '#cc9200',
          cyan: '#00d4ff',
          red: '#ff3355',
          'text-primary': '#e8f5ef',
          'text-secondary': '#6b8a7a',
          'text-muted': '#3a5040',
        }
      },
      boxShadow: {
        'glow-green': '0 0 12px #00ff8833, 0 0 24px #00ff8811',
        'glow-amber': '0 0 12px #ffb80033',
        'glow-cyan': '0 0 12px #00d4ff33',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'fadeIn': 'fadeIn 0.3s ease-out',
        'slideUp': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      }
    },
  },
  plugins: [],
}
