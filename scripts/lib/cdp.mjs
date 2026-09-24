/*
 * Minimaler Chrome-Fernsteuerer über das DevTools-Protokoll, ohne Abhängigkeit (Node 22+ hat
 * WebSocket eingebaut). Genutzt für die Screenshots der Anleitungen, damit sie reproduzierbar aus
 * dem echten Studio entstehen statt von Hand.
 *
 *   const b = await starteChrome({ breite: 1440, hoehe: 900 })
 *   await b.oeffne('http://localhost:5173/?beispiel=hund-katze-welt')
 *   await b.js('document.title')
 *   await b.foto('bild.png', { selektor: '.card' })
 *   await b.ende()
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'

const CHROME = process.env.CHROME_BIN ?? [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium',
].find((p) => fs.existsSync(p))

const warte = (ms) => new Promise((r) => setTimeout(r, ms))

export async function starteChrome({ breite = 1440, hoehe = 900, skala = 2, port = 9333 } = {}) {
  if (!CHROME) throw new Error('Kein Chrome gefunden. Pfad über CHROME_BIN setzen.')
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-'))
  const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`,
    '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', `--window-size=${breite},${hoehe}`, 'about:blank'], { stdio: 'ignore' })
  let ziel
  for (let i = 0; i < 50 && !ziel; i++) {
    await warte(200)
    try { ziel = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page') } catch { /* startet noch */ }
  }
  if (!ziel) { proc.kill(); throw new Error('Chrome antwortet nicht') }
  const ws = new WebSocket(ziel.webSocketDebuggerUrl)
  await new Promise((r, f) => { ws.onopen = r; ws.onerror = f })
  let id = 0
  const offen = new Map()
  const ereignisse = []
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data)
    if (d.id && offen.has(d.id)) {
      const { r, f } = offen.get(d.id)
      offen.delete(d.id)
      if (d.error) f(new Error(d.error.message)); else r(d.result)
    }
    else if (d.method) ereignisse.push(d)
  }
  const cdp = (method, params = {}) => new Promise((r, f) => { const n = ++id; offen.set(n, { r, f }); ws.send(JSON.stringify({ id: n, method, params })) })
  await cdp('Page.enable')
  await cdp('Runtime.enable')
  await cdp('Emulation.setDeviceMetricsOverride', { width: breite, height: hoehe, deviceScaleFactor: skala, mobile: false })

  const js = async (ausdruck) => {
    const r = await cdp('Runtime.evaluate', { expression: ausdruck, awaitPromise: true, returnByValue: true })
    if (r.exceptionDetails) throw new Error(`JS-Fehler: ${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text}`)
    return r.result.value
  }
  const fehler = () => ereignisse.filter((e) => e.method === 'Runtime.exceptionThrown' || (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error'))
  return {
    cdp, js, fehler,
    async oeffne(url, { warteMs = 1200 } = {}) {
      await cdp('Page.navigate', { url })
      for (let i = 0; i < 100; i++) { await warte(100); if (await js('document.readyState') === 'complete') break }
      await warte(warteMs)
    },
    /** Klickt das erste Element, dessen sichtbarer Text den Suchtext enthält. */
    async klick(text, selektor = 'button, a, [role=tab]') {
      const ok = await js(`(() => { const e = [...document.querySelectorAll(${JSON.stringify(selektor)})].find((x) => x.innerText.trim().includes(${JSON.stringify(text)})); if (!e) return false; e.scrollIntoView({ block: 'center' }); e.click(); return true })()`)
      if (!ok) throw new Error(`Kein Element mit Text „${text}“`)
      await warte(500)
    },
    async foto(datei, { selektor, rand = 0 } = {}) {
      let clip
      if (selektor) {
        const r = await js(`(() => { const e = document.querySelector(${JSON.stringify(selektor)}); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height } })()`)
        if (!r) throw new Error(`Selektor ${selektor} nicht gefunden`)
        clip = { x: Math.max(0, r.x - rand), y: Math.max(0, r.y - rand), width: r.width + 2 * rand, height: r.height + 2 * rand, scale: 1 }
      }
      const { data } = await cdp('Page.captureScreenshot', { format: 'png', ...(clip ? { clip, captureBeyondViewport: true } : {}) })
      fs.mkdirSync(path.dirname(datei), { recursive: true })
      fs.writeFileSync(datei, Buffer.from(data, 'base64'))
    },
    warte,
    async ende() { ws.close(); proc.kill(); await warte(300); fs.rmSync(profil, { recursive: true, force: true }) },
  }
}
