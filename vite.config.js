import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: './index.html',  // main entry point
        home: './home.html',   // add home.html as a separate entry point
      },
    },
  },
});


