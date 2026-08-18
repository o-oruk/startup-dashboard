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

/** Approximate hue (0-359) of a color string — handles both #rrggbb hex and hsl(h, s%, l%). */
export function colorToHue(color: string): number {
  if (color.startsWith('hsl')) {
    const match = color.match(/hsl\(\s*(-?[\d.]+)/)
    return match ? ((parseFloat(match[1]) % 360) + 360) % 360 : 0
  }
  const r = parseInt(color.slice(1, 3), 16) / 255
  const g = parseInt(color.slice(3, 5), 16) / 255
  const b = parseInt(color.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  if (delta === 0) return 0
  let hue: number
  if (max === r) hue = ((g - b) / delta) % 6
  else if (max === g) hue = (b - r) / delta + 2
  else hue = (r - g) / delta + 4
  hue *= 60
  return hue < 0 ? hue + 360 : hue
}

/** Shortest distance between two hues on the 360° circle. */
export function hueDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

/**
 * A curated 12-color palette (one representative shade per named color family),
 * not evenly-spaced by raw hue degree. Human vision is far less sensitive to hue
 * changes in the yellow/green band than in red/blue/violet, so a naive
 * evenly-spaced HSL wheel visually clusters several near-identical greens while
 * leaving reds thin. These stops are chosen by eye across the full spectrum so
 * every swatch actually reads as a distinct color, not just a distinct number.
 */
export const MEMBER_PALETTE: string[] = [
  '#dc2626', // red
  '#ea580c', // orange
  '#d97706', // amber
  '#ca8a04', // yellow
  '#65a30d', // lime
  '#16a34a', // green
  '#0d9488', // teal
  '#0891b2', // cyan
  '#2563eb', // blue
  '#4f46e5', // indigo
  '#7c3aed', // violet
  '#e11d48', // rose
]

/**
 * Minimum hue-degrees apart a new member color must be from every already-used
 * color. Kept below the smallest real gap between any two palette swatches
 * (~8.5°, amber↔yellow) so distinct swatches never block each other — this
 * only catches an actual duplicate (or near-duplicate) pick.
 */
export const MIN_COLOR_SEPARATION = 6
