import { resolve } from 'path';

export default async () => {
  const [{ default: react }, { default: tailwindcss }] = await Promise.all([
    import('@vitejs/plugin-react'),
    import('@tailwindcss/vite'),
  ]);

  return {
    plugins: [react(), tailwindcss()],
    publicDir: 'public',
    resolve: {
      alias: {
        '@components': '/src/components',
        '@context': '/src/context',
        '@services': '/src/services',
        '@hooks': '/src/hooks',
        '@pages': '/src/pages',
        '@utils': '/src/utils',
        '@e2e': '/src/e2e',
        '@test-setup': '/src/e2e/test-setup.ts',
        '@types': '/src/types',
        '@assets': '/public/assets',
        '@crypture/api-client': resolve(
          __dirname,
          '../../libs/api-client/src/index.ts'
        ),
        '@crypture/shared-types': resolve(
          __dirname,
          '../../libs/shared-types/src/index.ts'
        ),
        '@crypture/utils': resolve(__dirname, '../../libs/utils/src/index.ts'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      host: true,
      fs: {
        allow: [
          '/Users/nati-home/Projects/crypture/apps/frontend',
          '/Users/nati-home/Projects/crypture/libs',
          '/Users/nati-home/Projects/crypture/node_modules',
        ],
      },
    },
  };
};
