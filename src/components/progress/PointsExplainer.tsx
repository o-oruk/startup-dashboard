import { LEVEL_COLOR, LEVEL_LABEL, type PointLevel } from '../../lib/progress'

const LEVELS: PointLevel[] = ['red', 'orange', 'yellow', 'green']

export function PointsExplainer() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-600">
        Every completed task is worth its weight (Small = 1, Medium = 2, Large = 3). A day's points
        are the sum of weights for tasks completed that day. Colors show how the day went.
      </p>
      <div className="mt-3 flex flex-wrap gap-4">
        {LEVELS.map((level) => (
          <div key={level} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: LEVEL_COLOR[level] }}
            />
            {LEVEL_LABEL[level]}
          </div>
        ))}
      </div>
    </div>
  )
}
