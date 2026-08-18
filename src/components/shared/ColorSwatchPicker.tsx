import { MEMBER_PALETTE, MIN_COLOR_SEPARATION, colorToHue, hueDistance } from '../../lib/color'

export function ColorSwatchPicker({
  value,
  onChange,
  takenColors,
}: {
  value: string
  onChange: (color: string) => void
  takenColors: string[]
}) {
  const takenHues = takenColors.map(colorToHue)
  const available = MEMBER_PALETTE.filter((swatch) => {
    if (swatch === value) return true
    const swatchHue = colorToHue(swatch)
    return !takenHues.some((h) => hueDistance(h, swatchHue) < MIN_COLOR_SEPARATION)
  })

  return (
    <div className="flex flex-wrap gap-2">
      {available.map((swatch) => {
        const selected = swatch === value
        return (
          <button
            key={swatch}
            type="button"
            onClick={() => onChange(swatch)}
            aria-label="Choose this color"
            aria-pressed={selected}
            className={`h-8 w-8 rounded-full border-2 transition-all ${
              selected ? 'scale-110 border-slate-900' : 'border-transparent hover:scale-110 hover:border-slate-300'
            }`}
            style={{ backgroundColor: swatch }}
          />
        )
      })}
      {available.length === 0 && (
        <p className="text-xs text-slate-400">No colors left — ask a teammate to free one up.</p>
      )}
    </div>
  )
}
