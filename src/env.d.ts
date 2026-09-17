/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_GA_ID?: string
  readonly VITE_CF_BEACON?: string
  readonly VITE_GSC_VERIFICATION?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
