/**
 * Picks a hue as far as possible from every hue already in use, by finding the
 * largest gap on the 360° hue circle and dropping the new hue in its midpoint.
 * This maximizes the minimum distance to existing colors as objectives are added over time.
 */
export function nextDistinctHue(existingHues: number[]): number {
  if (existingHues.length === 0) return Math.floor(Math.random() * 360)
  if (existingHues.length === 1) return Math.round((existingHues[0] + 180) % 360)

  const sorted = [...existingHues].sort((a, b) => a - b)
  let bestStart = sorted[0]
  let bestGap = 0
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i]
    const b = i + 1 < sorted.length ? sorted[i + 1] : sorted[0] + 360
    const gap = b - a
    if (gap > bestGap) {
      bestGap = gap
      bestStart = a
    }
  }
  return Math.round((bestStart + bestGap / 2) % 360)
}

export const paleHue = (hue: number) => `hsl(${hue}, 75%, 95%)`
export const paleTextHue = (hue: number) => `hsl(${hue}, 55%, 32%)`
export const vividHue = (hue: number) => `hsl(${hue}, 62%, 47%)`

/** Hand-picked, fixed 8-color member palette. Each is meant to be used by at most one person at a time. */
export const MEMBER_PALETTE: string[] = [
  '#E11D2A', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#16A34A', // green
  '#2563EB', // blue
  '#9333EA', // violet
  '#8B5A2B', // brown
  '#1F2937', // black
]

/** Initials render in white by default; a couple of light swatches need a dark override for legibility. */
export const TEXT_COLOR_OVERRIDES: Record<string, string> = {
  '#EAB308': '#3D2E00',
}

export function textColorFor(background: string): string {
  return TEXT_COLOR_OVERRIDES[background.toUpperCase()] ?? 'white'
}
