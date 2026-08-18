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

  return (
    <div className="flex flex-wrap gap-2">
      {MEMBER_PALETTE.map((swatch) => {
        const swatchHue = colorToHue(swatch)
        const selected = swatch === value
        const taken = !selected && takenHues.some((h) => hueDistance(h, swatchHue) < MIN_COLOR_SEPARATION)
        return (
          <button
            key={swatch}
            type="button"
            disabled={taken}
            onClick={() => onChange(swatch)}
            aria-label={taken ? 'Too close to a color already in use' : 'Choose this color'}
            title={taken ? 'Too close to a color already in use' : undefined}
            className={`h-8 w-8 rounded-full border-2 transition-all ${
              taken
                ? 'cursor-not-allowed opacity-20'
                : selected
                  ? 'scale-110 border-slate-900'
                  : 'border-transparent hover:scale-110 hover:border-slate-300'
            }`}
            style={{ backgroundColor: swatch }}
          />
        )
      })}
    </div>
  )
}
