import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: ['node18'],
  outfile: 'dist/index.cjs',
  format: 'cjs',
  banner: { js: '#!/usr/bin/env node' },
  minify: false,
  treeShaking: true,
});

console.log('✓ dist/index.cjs');
