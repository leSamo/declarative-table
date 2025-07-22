import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  mode: 'production',
  plugins: [react()],
   build: {
    sourcemap: true,
    minify: true,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'DeclarativeTable',
      fileName: (format) => `declarativeTable.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
