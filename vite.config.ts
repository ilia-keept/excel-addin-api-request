import fs from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const certDir = path.join(homedir(), '.office-addin-dev-certs')

const hasDevCerts =
  fs.existsSync(path.join(certDir, 'localhost.key')) &&
  fs.existsSync(path.join(certDir, 'localhost.crt'))

export default defineConfig({
  plugins: [react()],
  server: {
    https: hasDevCerts
      ? {
          key: fs.readFileSync(path.join(certDir, 'localhost.key')),
          cert: fs.readFileSync(path.join(certDir, 'localhost.crt')),
        }
      : undefined,
    port: 3000,
    proxy: {
      '/api/deezer': {
        target: 'http://localhost:9476',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(import.meta.dirname, 'taskpane.html'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
})
