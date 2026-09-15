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
    port: 5180, // ปรับให้ตรงกับ Port ที่กำลังใช้งาน
    proxy: {
      // Forward คำขอ /api ไปยัง Server 115.84.105.127:9999
      '/api': {
        target: 'http://115.84.105.127:9999',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})