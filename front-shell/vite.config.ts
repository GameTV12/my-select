import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from "@originjs/vite-plugin-federation"
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      vue(),
      federation({
        name: 'front_shell',
        remotes: {
            front_registration: "http://localhost:3001/assets/remoteEntry.js",
            front_post: "http://localhost:3002/assets/remoteEntry.js",
        },
        shared: ['react', 'react-dom', 'vue']
      })
  ],
    server: {
      host: "127.0.0.1",
      port: 3000,
    },
    preview: {
        host: "127.0.0.1",
        port: 3000,
    },
    cacheDir: "node_modules/.cacheDir",
    build: {
        modulePreload: false,
        target: 'esnext',
        minify: false,
        cssCodeSplit: false
    }
})
