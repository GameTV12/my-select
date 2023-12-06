import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'front_post',
      filename: 'remoteEntry.js',
      // Modules to expose
      exposes: {
        './PostList': './src/pages/PostList',
        './UserPostList': './src/pages/UserPostList',
        './SinglePost': './src/pages/SinglePost',
        './WritePost': './src/components/createPost/WritePost',
        './EditPost': './src/components/createPost/EditPost'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    host: "127.0.0.1",
    port: 3002,
    cors: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 3002,
    cors: true,
  },
  cacheDir: "node_modules/.cacheDir",
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
})
