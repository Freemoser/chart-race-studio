import type { ChartHandle, ChartInput } from './types'
import { createLineRace } from './lineRace'

export async function createChart(kind: 'bar' | 'line', container: HTMLElement, input: ChartInput): Promise<ChartHandle> {
  if (kind === 'line') return createLineRace(container, input)
  const { createBarRace } = await import('./racingBars')
  return createBarRace(container, input)
}
