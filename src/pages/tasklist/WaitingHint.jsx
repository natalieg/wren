import useProjectsContext from '../../hooks/useProjectsContext'
import { formatTime } from '../../utils/formatTime'

// one quiet line per blocks-only project whose day tasks sit outside any block
export default function WaitingHint({ tasks }) {
   const { projects } = useProjectsContext()
   const waiting = projects
      .map(p => ({ project: p, tasks: tasks.filter(t => t.project === p.id) }))
      .filter(w => w.tasks.length > 0)
   if (waiting.length === 0) return null

   return (
      <div className='w-[80%] flex flex-col gap-0.5 text-xs text-text-muted select-none'>
         {waiting.map(({ project, tasks }) => (
            <p key={project.id} title='Add a time block for this project and they move in'>
               ▦ {tasks.length} {project.name} {tasks.length === 1 ? 'task waits' : 'tasks wait'} for a block
               · {formatTime(tasks.reduce((sum, t) => sum + (parseInt(t.time) || 0), 0))}
            </p>
         ))}
      </div>
   )
}
