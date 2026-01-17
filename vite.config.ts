import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'google-maps': ['@react-google-maps/api', '@googlemaps/markerclusterer'],
          'vendor': ['react', 'react-dom', 'zustand'],
        },
      },
    },
  },
})
