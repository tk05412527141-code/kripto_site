import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        kriptoAl: resolve(__dirname, 'kripto-al.html'),
        kriptoSat: resolve(__dirname, 'kripto-sat.html'),
        hakkimizda: resolve(__dirname, 'hakkimizda.html'),
        gizlilik: resolve(__dirname, 'gizlilik.html'),
      },
    },
  },
});
