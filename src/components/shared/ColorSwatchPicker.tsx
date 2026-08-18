import { MEMBER_PALETTE } from '../../lib/color'

export function ColorSwatchPicker({
  value,
  onChange,
  takenColors,
}: {
  value: string
  onChange: (color: string) => void
  takenColors: string[]
}) {
  const taken = new Set(takenColors.map((c) => c.toUpperCase()))

  return (
    <div className="flex flex-wrap gap-2">
      {MEMBER_PALETTE.map((swatch) => {
        const isTaken = taken.has(swatch.toUpperCase()) && swatch.toUpperCase() !== value.toUpperCase()
        const selected = swatch.toUpperCase() === value.toUpperCase()
        return (
          <button
            key={swatch}
            type="button"
            disabled={isTaken}
            onClick={() => onChange(swatch)}
            aria-label={isTaken ? 'Already taken by a teammate' : 'Choose this color'}
            aria-pressed={selected}
            title={isTaken ? 'Already taken by a teammate' : undefined}
            className={`relative h-8 w-8 rounded-full border-2 transition-all ${
              isTaken
                ? 'cursor-not-allowed border-transparent'
                : selected
                  ? 'scale-110 border-slate-900'
                  : 'border-transparent hover:scale-110 hover:border-slate-300'
            }`}
            style={{ backgroundColor: swatch }}
          >
            {isTaken && (
              <svg viewBox="0 0 32 32" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <line x1="6" y1="6" x2="26" y2="26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="6" y1="6" x2="26" y2="26" stroke="black" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
