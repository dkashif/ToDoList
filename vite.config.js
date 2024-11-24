import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext', // Ensure top-level await is supported
  },
});
