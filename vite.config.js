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
        nasilCalisir: resolve(__dirname, 'nasil-calisir.html'),
        kycDogrulama: resolve(__dirname, 'kyc-dogrulama.html'),
        kullanimKosullari: resolve(__dirname, 'kullanim-kosullari.html'),
        dolandiricilikOnleme: resolve(__dirname, 'dolandiricilik-onleme.html'),
        mesafeliSatis: resolve(__dirname, 'mesafeli-satis.html'),
        gizlilik: resolve(__dirname, 'gizlilik.html'),
        acikRiza: resolve(__dirname, 'acik-riza.html'),
        veriIsleme: resolve(__dirname, 'veri-isleme.html'),
        sorumlulukReddi: resolve(__dirname, 'sorumluluk-reddi.html'),
      },
    },
  },
});
