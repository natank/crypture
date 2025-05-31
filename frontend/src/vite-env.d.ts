// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COINGECKO_API_KEY: string;
  // add more vars as needed...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
