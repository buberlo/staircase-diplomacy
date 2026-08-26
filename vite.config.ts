import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const nodeEnv = isProduction ? 'production' : 'development';

  return {
    base: './',
    root: '.',
    server: {
      host: true,
      port: 5173,
      strictPort: false,
      open: false,
      clearScreen: false,
      fs: {
        allow: ['..']
      }
    },
    preview: {
      host: true,
      port: 4173,
      strictPort: false,
      open: false
    },
    build: {
      target: 'es2022',
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      chunkSizeWarningLimit: 1500,
      reportCompressedSize: false,
      rollupOptions: {
        input: 'index.html',
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
          manualChunks: {
            phaser: ['phaser']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['phaser'],
      esbuildOptions: {
        target: 'es2022'
      }
    },
    esbuild: {
      target: 'es2022'
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(nodeEnv)
    }
  };
});