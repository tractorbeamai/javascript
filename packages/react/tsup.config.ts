import { defineConfig, Options } from 'tsup';
import fs from 'fs/promises';
import path from 'path';

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['src/server/index.ts', 'src/client/index.ts', 'src/hooks/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  clean: true,
  external: ['react'],
  ...options,
  async onSuccess() {
    // add "use client" banner to /dist/client entry point
    await fs.writeFile(
      path.join(__dirname, 'dist', 'client', 'index.js'),
      '"use client";\n' +
        (await fs.readFile(path.join(__dirname, 'dist', 'client', 'index.js'))),
    );
    await fs.writeFile(
      path.join(__dirname, 'dist', 'client', 'index.mjs'),
      '"use client";\n' +
        (await fs.readFile(
          path.join(__dirname, 'dist', 'client', 'index.mjs'),
        )),
    );
  },
}));
