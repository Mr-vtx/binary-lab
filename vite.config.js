import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // When running `npm run dev` (plain Vite, port 5173),
    // proxy /api calls to the vercel dev server (port 3000)
    // so serverless functions work without running vercel dev as the main process.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
