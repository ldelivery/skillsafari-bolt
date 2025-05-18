/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly ZERO_AUTH_SECRET: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}