import { defineConfig } from 'vite';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { sites } from './build/sites-vite-plugin.ts';
export default defineConfig({
  build: { outDir: 'dist/client' },
  plugins: [sites(), {
    name: 'portfolio-worker',
    apply: 'build',
    async closeBundle() {
      await mkdir('dist/server', { recursive: true });
      await copyFile('worker/index.js', 'dist/server/index.js');
      await writeFile('dist/server/wrangler.json', JSON.stringify({
        name: 'rovin-portfolio', main: 'index.js', compatibility_date: '2026-09-01',
        assets: { directory: '../client', binding: 'ASSETS' }
      }));
    }
  }]
});
