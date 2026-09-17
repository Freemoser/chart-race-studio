import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { useApp } from './state/store'

// Debug-Zugriff im Dev-Modus (gleiche Store-Instanz wie die App)
if (import.meta.env.DEV) (window as unknown as { __crs: unknown }).__crs = { useApp }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
