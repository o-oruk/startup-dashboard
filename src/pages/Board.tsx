import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useObjectives } from '../hooks/useObjectives'
import { useProfiles } from '../hooks/useProfiles'
import { useTasks } from '../hooks/useTasks'
import { ObjectiveTabs } from '../components/objectives/ObjectiveTabs'
import { TaskForm } from '../components/objectives/TaskForm'
import { TaskRow } from '../components/objectives/TaskRow'

export function Board() {
  const { profile } = useAuth()
  const { objectives, addObjective, deleteObjective } = useObjectives()
  const { profiles } = useProfiles()
  const { tasks, addTask, updateTask, deleteTask, pushToDaily, completeTask, reopenTask } =
    useTasks()
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!activeId && objectives.length > 0) setActiveId(objectives[0].id)
    if (activeId && !objectives.some((o) => o.id === activeId)) {
      setActiveId(objectives[0]?.id ?? null)
    }
  }, [objectives, activeId])

  const activeTasks = tasks
    .filter((t) => t.objective_id === activeId)
    .sort((a, b) => {
      const order = { backlog: 0, daily: 1, done: 2 }
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status]
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  async function handleDeleteObjective(id: string) {
    const count = tasks.filter((t) => t.objective_id === id).length
    const objTitle = objectives.find((o) => o.id === id)?.title ?? 'this objective'
    const message =
      count > 0
        ? `Delete "${objTitle}"? This will also permanently delete its ${count} task${count === 1 ? '' : 's'}.`
        : `Delete "${objTitle}"?`
    if (confirm(message)) await deleteObjective(id)
  }

  if (objectives.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
        <p className="text-slate-600">No objectives yet. Add your first one to get started.</p>
        <div className="mt-4 flex justify-center">
          <ObjectiveTabs
            objectives={[]}
            activeId={null}
            onSelect={() => {}}
            onAdd={addObjective}
            onDelete={handleDeleteObjective}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <ObjectiveTabs
        objectives={objectives}
        activeId={activeId}
        onSelect={setActiveId}
        onAdd={addObjective}
        onDelete={handleDeleteObjective}
      />

      {profile && (
        <TaskForm
          profiles={profiles}
          onSubmit={async ({ title, weight, assigneeId }) => {
            if (!activeId) return
            await addTask({
              objectiveId: activeId,
              title,
              weight,
              assigneeId,
              createdBy: profile.id,
            })
          }}
        />
      )}

      {activeTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          This bucket is empty. Add a task above to start building the roadmap for this objective.
        </div>
      ) : (
        <ul className="space-y-2">
          {activeTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              profiles={profiles}
              onUpdate={(fields) => updateTask(task.id, fields)}
              onDelete={() => deleteTask(task.id)}
              onPushToDaily={() => pushToDaily(task.id, task.assignee_id)}
              onComplete={() => (profile ? completeTask(task.id, profile.id) : Promise.resolve())}
              onReopen={() => reopenTask(task)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
