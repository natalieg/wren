import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

// one DndContext per page, wrapping every TaskGroup on it — dragging between two lists
// is only possible inside a shared context, so this never belongs in TaskGroup itself.
export default function TaskDndArea({ onReorder, children }) {
    // below 8px it stays a click and opens the task modal instead of starting a drag
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    )

    const handleDragEnd = ({ active, over }) => {
        // over is null when the drop lands outside any sortable
        if (!over || active.id === over.id) return
        onReorder(active.id, over.id)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            {children}
        </DndContext>
    )
}
