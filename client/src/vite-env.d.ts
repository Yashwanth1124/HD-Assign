/// <reference types="vite/client" />

// Optional: strongly type your Vite envs used in the app
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}