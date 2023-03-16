import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      federation({
        name: 'front-user',
        filename: 'remoteEntry.js',
        // Modules to expose
        exposes: {
          './Hello': './src/components/HelloWorld.vue',
        },
        shared: ['vue']
      })
  ],
    build: {
        minify: false,
        target: ["chrome89", "edge89", "firefox89", "safari15"]
    },
    server: {
        host: "127.0.0.1",
        port: 3001
    },
    preview: {
        host: "127.0.0.1",
        port: 3001,
    },
})
