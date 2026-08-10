import { useDndContext, useDroppable } from '@dnd-kit/core'

// Registers a whole list area as one drop target and frames it while a drag is over it.
// It sits *outside* the list's content on purpose: a collapsed section is a 0fr grid row,
// so anything registered inside one has no height to hit. Wrapping the section — header
// included — is what lets a closed list still be dropped into, without opening it and
// throwing the page around mid-drag.
//
// The empty-list min-height is unconditional rather than drag-only for the same reason
// the sections always render: growing at drag start shifts the row dnd-kit just measured,
// and the preview then hangs that far off the cursor for the whole drag.
export default function TaskDropZone({ groupId, tasks = [], className = '', children }) {
    const { setNodeRef } = useDroppable({ id: groupId })
    const { active, over } = useDndContext()

    const holdsDragged = !!active && tasks.some(t => t.id === active.id)
    const isOver = !!over && (over.id === groupId || tasks.some(t => t.id === over.id))
    const highlight = holdsDragged || isOver

    return (
        <div ref={setNodeRef}
            className={`rounded-md transition-[outline-color] duration-(--dur-fast)
            outline-2 outline-offset-4 ${tasks.length === 0 ? 'min-h-12' : ''}
            ${highlight ? 'outline-accent-muted bg-accent-soft/30' : 'outline-transparent'}
            ${className}`}>
            {children}
        </div>
    )
}
