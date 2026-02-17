/// <reference types="vite/client" />
/// <reference types="vue" />

interface ImportMetaEnv {
  readonly VITE_FOOTBALL_API_KEY?: string
  readonly VITE_APIFOOTBALL_KEY?: string
  readonly VITE_SPORTMONKS_API_TOKEN?: string
  readonly VITE_SCRAPINGBEE_API_KEY?: string
  readonly VITE_NEWSDATA_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
