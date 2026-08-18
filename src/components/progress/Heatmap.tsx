import { LEVEL_COLOR, levelForPoints, toWeeks } from '../../lib/progress'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function Heatmap({
  dates,
  pointsByDate,
  today,
  joinedDate,
  cellSize = 13,
}: {
  dates: string[]
  pointsByDate: Map<string, number>
  today: string
  joinedDate?: string
  cellSize?: number
}) {
  const weeks = toWeeks(dates)

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => {
          const firstDateInWeek = week.find((d): d is string => d !== null)
          const isFirstWeekOfMonth =
            !!firstDateInWeek && new Date(firstDateInWeek + 'T00:00:00').getDate() <= 7
          return (
            <div key={wi} className="flex flex-col gap-[3px]">
              <div style={{ height: 12 }} className="text-[10px] leading-none text-slate-400">
                {isFirstWeekOfMonth && firstDateInWeek
                  ? MONTH_NAMES[new Date(firstDateInWeek + 'T00:00:00').getMonth()]
                  : ''}
              </div>
              {week.map((date, di) => {
                if (!date) {
                  return (
                    <div key={di} style={{ width: cellSize, height: cellSize }} />
                  )
                }
                const points = pointsByDate.get(date) ?? 0
                const level = levelForPoints(points, date, today, joinedDate)
                const title =
                  level === 'not-joined' ? `${date} — not on the team yet` : `${date} — ${points} point${points === 1 ? '' : 's'}`
                return (
                  <div
                    key={di}
                    title={title}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: LEVEL_COLOR[level],
                    }}
                    className="rounded-[3px]"
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
