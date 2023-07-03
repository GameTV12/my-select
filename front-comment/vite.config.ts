import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'front_comment',
      filename: 'remoteEntry.js',
      // Modules to expose
      exposes: {
        './Comment': './src/components/Comment'
      },
      shared: ['react', 'react-dom']
    })
  ],
  server: {
    host: "127.0.0.1",
    port: 3006
  },
  preview: {
    host: "127.0.0.1",
    port: 3006,
  },
  cacheDir: "node_modules/.cacheDir",
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
