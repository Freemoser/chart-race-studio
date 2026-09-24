import { describe, expect, it } from 'vitest'
import { ordneZu, summenSpalte } from '@/lib/chart/geo'

// Sichert die Kartenregeln aus docs/DATENSTANDARD.md, Abschnitte 3 und 4.
describe('Datenstandard: Karten', () => {
  it('erkennt Ländernamen deutsch, englisch und als ISO-Code', () => {
    const z = ordneZu(['Deutschland', 'France', 'JP', 'USA', 'DR Congo', 'Türkiye', 'Czech Republic'])
    expect(z.karte).toBe('welt')
    expect(z.ohneFlaeche).toEqual([])
    expect(z.spalteFuer.get('Germany')).toBe('Deutschland')
    expect(z.spalteFuer.get('Democratic Republic of the Congo')).toBe('DR Congo')
  })
  it('trennt Summenspalten ab und liest Name und Einheit', () => {
    const z = ordneZu(['Deutschland', 'Summe: Hunde (Mio.)', 'gesamt: Katzen'])
    expect(z.summen).toEqual(['Summe: Hunde (Mio.)', 'gesamt: Katzen'])
    expect(z.spalteFuer.size).toBe(1)
    expect(summenSpalte('Summe: Hunde (Mio.)')).toEqual({ name: 'Hunde', einheit: 'Mio.' })
    expect(summenSpalte('Total: Katzen')).toEqual({ name: 'Katzen', einheit: '' })
  })
  it('wählt die Bundesländerkarte, wenn Bundesländer überwiegen', () => {
    const z = ordneZu(['Bayern', 'Nordrhein-Westfalen', 'baden wurttemberg', 'Berlin'])
    expect(z.karte).toBe('bundeslaender')
    expect(z.ohneFlaeche).toEqual([])
  })
  it('meldet Kleinstaaten und Unbekanntes als ohne Fläche', () => {
    const z = ordneZu(['Deutschland', 'Malta', 'Atlantis'])
    expect(z.ohneFlaeche).toEqual(['Malta', 'Atlantis'])
  })
})
