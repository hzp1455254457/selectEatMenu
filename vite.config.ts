import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import { resolve } from 'node:path'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    electron({
      main: {
        entry: 'electron-main/index.ts'
      },
      preload: {
        input: resolve(__dirname, 'electron-preload/index.ts'),
        vite: {
          build: {
            rollupOptions: {
              output: {
                format: 'cjs',
                entryFileNames: '[name].cjs',
              },
            },
          },
        },
      }
    })
  ],
  build: {
    outDir: 'dist'
  }
})
