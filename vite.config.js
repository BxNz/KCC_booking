import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      // เมื่อยิงคำขอไปที่ /api จะถูก Forward ไปที่ Backend IP 10.0.200.103:8018 เพื่อแก้ปัญหา CORS
      '/api': {
        target: 'http://10.0.200.103:8018',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})