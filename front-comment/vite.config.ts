import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    federation({
      name: 'front-comment',
      filename: 'remoteEntry.js',
      // Modules to expose
      remotes: {
       front_registration: "http://localhost:3001/assets/remoteEntry.js",
      },
      shared: ['vue']
    }),
  ],
  build: {
    minify: false,
    target: ["chrome89", "edge89", "firefox89", "safari15"]
  },
  server: {
    host: "127.0.0.1",
    port: 3004
  },
  preview: {
    host: "127.0.0.1",
    port: 3004,
  },
})
