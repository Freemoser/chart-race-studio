/*
 * Erzeugt alle Favicon-Größen aus einer Quelle: public/favicon.svg.
 * Aufruf: npm run icons
 *
 * Warum selbst rastern und keine Bibliothek: Das Symbol besteht aus vier abgerundeten
 * Rechtecken. Dafür lohnt keine Abhängigkeit, und so ist das Ergebnis reproduzierbar –
 * im Browser einmalig erzeugte Dateien laufen beim nächsten Mal auseinander.
 *
 * 96 statt 64 Pixel ist kein Zufall: Google übernimmt ein Favicon in die Suchergebnisse
 * nur, wenn die Kantenlänge ein Vielfaches von 48 ist. Ein 32er allein wird ignoriert,
 * und in den Ergebnissen steht dann der graue Standard-Globus.
 */
import fs from 'node:fs'
import zlib from 'node:zlib'

const SVG = 'public/favicon.svg'
const quelle = fs.readFileSync(SVG, 'utf8')
const viewBox = +(quelle.match(/viewBox="0 0 (\d+)/)?.[1] ?? 28)

/** Rechtecke aus dem SVG lesen, damit Symbol und Icons dieselbe Quelle haben. */
const rects = [...quelle.matchAll(/<rect([^>]*)\/>/g)].map((m) => {
  const a = (n, d = 0) => { const v = m[1].match(new RegExp(`${n}="([^"]*)"`)); return v ? parseFloat(v[1]) : d }
  const fill = m[1].match(/fill="([^"]*)"/)?.[1] ?? '#000'
  const op = m[1].match(/opacity="([^"]*)"/)?.[1]
  return { x: a('x'), y: a('y'), w: a('width'), h: a('height'), r: a('rx'), fill, alpha: op ? parseFloat(op) : 1 }
})
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))

/** Deckungsgrad eines Punktes in einem abgerundeten Rechteck (1 = innen, 0 = außen). */
const drin = (p, r) => {
  const { x, y } = p
  if (x < r.x || y < r.y || x > r.x + r.w || y > r.y + r.h) return false
  const cx = Math.min(Math.max(x, r.x + r.r), r.x + r.w - r.r)
  const cy = Math.min(Math.max(y, r.y + r.r), r.y + r.h - r.r)
  const dx = x - cx, dy = y - cy
  return dx * dx + dy * dy <= r.r * r.r + 1e-9
}

function rastern(size) {
  const SS = 4 // Supersampling gegen Treppen an den Rundungen
  const px = new Uint8Array(size * size * 4)
  for (let py = 0; py < size; py++) {
    for (let pxi = 0; pxi < size; pxi++) {
      let R = 0, G = 0, B = 0, A = 0
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const p = { x: (pxi + (sx + 0.5) / SS) / size * viewBox, y: (py + (sy + 0.5) / SS) / size * viewBox }
        let r = 0, g = 0, b = 0, a = 0
        for (const rc of rects) {
          if (!drin(p, rc)) continue
          const [cr, cg, cb] = hex(rc.fill === '#fff' ? '#ffffff' : rc.fill)
          const al = rc.alpha
          r = cr * al + r * (1 - al); g = cg * al + g * (1 - al); b = cb * al + b * (1 - al)
          a = al + a * (1 - al)
        }
        R += r; G += g; B += b; A += a
      }
      const n = SS * SS, i = (py * size + pxi) * 4
      px[i] = Math.round(R / n); px[i + 1] = Math.round(G / n); px[i + 2] = Math.round(B / n); px[i + 3] = Math.round(A / n * 255)
    }
  }
  return px
}

const crcTab = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0 })
const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTab[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
const chunk = (typ, daten) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(daten.length)
  const körper = Buffer.concat([Buffer.from(typ, 'ascii'), daten])
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(körper))
  return Buffer.concat([len, körper, c])
}
function png(size) {
  const px = rastern(size)
  const roh = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    roh[y * (size * 4 + 1)] = 0 // Filter: keiner
    Buffer.from(px.buffer, y * size * 4, size * 4).copy(roh, y * (size * 4 + 1) + 1)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(roh, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ])
}

/** ICO mit eingebettetem PNG – seit Vista zulässig, 22 Byte Kopf genügen. */
function ico(pngBuf, size) {
  const kopf = Buffer.alloc(22)
  kopf.writeUInt16LE(0, 0); kopf.writeUInt16LE(1, 2); kopf.writeUInt16LE(1, 4)
  kopf[6] = size >= 256 ? 0 : size; kopf[7] = size >= 256 ? 0 : size
  kopf[8] = 0; kopf[9] = 0
  kopf.writeUInt16LE(1, 10); kopf.writeUInt16LE(32, 12)
  kopf.writeUInt32LE(pngBuf.length, 14); kopf.writeUInt32LE(22, 18)
  return Buffer.concat([kopf, pngBuf])
}

const ziele = { 'favicon-32.png': 32, 'favicon-96.png': 96, 'apple-touch-icon.png': 180 }
for (const [datei, size] of Object.entries(ziele)) {
  fs.writeFileSync(`public/${datei}`, png(size))
  console.log(`public/${datei} · ${size}×${size} · ${(fs.statSync(`public/${datei}`).size / 1024).toFixed(1)} kB`)
}
fs.writeFileSync('public/favicon.ico', ico(png(32), 32))
console.log(`public/favicon.ico · 32×32 · ${(fs.statSync('public/favicon.ico').size / 1024).toFixed(1)} kB`)
