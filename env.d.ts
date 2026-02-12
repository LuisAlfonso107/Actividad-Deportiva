/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FOOTBALL_API_KEY?: string
  readonly VITE_APIFOOTBALL_KEY?: string
  readonly VITE_SPORTMONKS_API_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
