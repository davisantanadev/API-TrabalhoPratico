import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /api -> API ASP.NET (certificado de desenvolvimento, por isso secure:false)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7001',
        secure: false,
        changeOrigin: true,
      },
    },
  },
})
