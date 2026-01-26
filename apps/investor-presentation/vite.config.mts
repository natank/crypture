/// <reference types='vitest' />
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export default async () => {
  const [{ default: react }, { nxViteTsPaths }, { nxCopyAssetsPlugin }] =
    await Promise.all([
      import('@vitejs/plugin-react'),
      import('@nx/vite/plugins/nx-tsconfig-paths.plugin'),
      import('@nx/vite/plugins/nx-copy-assets.plugin'),
    ]);
  const root = dirname(fileURLToPath(import.meta.url));

  return {
    root,
    cacheDir: '../../node_modules/.vite/apps/investor-presentation',
    server: {
      port: 4200,
      host: 'localhost',
    },
    preview: {
      port: 4200,
      host: 'localhost',
    },
    plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
    // Uncomment this if you are using workers.
    // worker: {
    //   plugins: () => [ nxViteTsPaths() ],
    // },
    build: {
      outDir: '../../dist/apps/investor-presentation',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    test: {
      name: 'investor-presentation',
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/investor-presentation',
        provider: 'v8' as const,
      },
    },
  };
};
