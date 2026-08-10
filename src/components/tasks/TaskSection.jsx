import CollapsableDiv from '../CollapsableDiv'
import TaskDropZone from './TaskDropZone'
import TaskGroup from './TaskGroup'

// A collapsible list that stays a drop target while collapsed — drag onto the closed
// section, it frames itself, drop, done. Two things it deliberately does not do:
// open during a drag (reflowing the page under a held task loses your scroll position),
// or appear only when it has tasks. Anything that changes the layout at drag start
// invalidates the position dnd-kit measured, and the preview sits offset from the
// cursor for the rest of the drag — so an empty section renders its header anyway.
export default function TaskSection({ label, tasks, groupId, collapseAction, showEstimate, taskActions, children }) {
    return (
        <TaskDropZone groupId={groupId} tasks={tasks}>
            <CollapsableDiv label={`${label} (${tasks.length})`} collapseAction={collapseAction}>
                <TaskGroup tasks={tasks} groupId={groupId} {...taskActions} showEstimate={showEstimate} />
                {children}
            </CollapsableDiv>
        </TaskDropZone>
    )
}
