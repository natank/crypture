/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_FEATURE_FLAG: "true" | "false";
  // Add other custom environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
