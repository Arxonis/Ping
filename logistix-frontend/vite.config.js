import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // toute requête à /api/* sera forwardée vers le Quarkus sur le port 8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // facultatif
      },
    },
  },
});
