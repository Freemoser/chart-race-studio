import type { ChartHandle, ChartInput } from './types'
import { createLineRace } from './lineRace'
import { createMapRace } from './mapRace'

export async function createChart(kind: 'bar' | 'line' | 'map', container: HTMLElement, input: ChartInput): Promise<ChartHandle> {
  if (kind === 'line') return createLineRace(container, input)
  if (kind === 'map') return createMapRace(container, input)
  const { createBarRace } = await import('./racingBars')
  return createBarRace(container, input)
}
