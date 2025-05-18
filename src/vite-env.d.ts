/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ZERO_AUTH_SECRET: string
  readonly ZERO_REPLICA_FILE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}