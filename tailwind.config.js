/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg:           "#0a0c0f",
          panel:        "#0e1117",
          border:       "#1a2030",
          green:        "#00ff88",
          amber:        "#ffb800",
          cyan:         "#00d4ff",
          red:          "#ff3355",
          "green-muted":"#004d2a",
          "text-primary":   "#e8f5ef",
          "text-secondary": "#a8c8b8",
          "text-muted":     "#6b8a7a",
        },
      },
      fontFamily: {
        display: ["Share Tech Mono", "monospace"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      screens: {
        md: "768px",
      },
    },
  },
  plugins: [],
};
