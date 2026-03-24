import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {copyFileSync, existsSync, mkdirSync, readFileSync} from 'fs';
import {resolve} from 'path';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'copy-html-files',
        buildEnd() {
          const distDir = resolve(__dirname, 'dist');
          const filesToCopy = ['privacy-policy.html', 'user-agreement.html'];
          
          if (!existsSync(distDir)) {
            mkdirSync(distDir, {recursive: true});
          }
          
          filesToCopy.forEach(file => {
            const srcPath = resolve(__dirname, file);
            const destPath = resolve(distDir, file);
            if (existsSync(srcPath)) {
              copyFileSync(srcPath, destPath);
              console.log(`Copied ${file} to ${destPath}`);
            }
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      port: 3007,
      host: '0.0.0.0'
    },
  };
});
