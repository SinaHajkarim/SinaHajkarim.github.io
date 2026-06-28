import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User site (sinamh.github.io) serves at the domain root.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
