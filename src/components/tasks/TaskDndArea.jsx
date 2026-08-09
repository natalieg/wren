import { useState } from 'react'
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

// one DndContext per page, wrapping every TaskGroup on it — dragging between two lists
// is only possible inside a shared context, so this never belongs in TaskGroup itself.
export default function TaskDndArea({ onReorder, onMoveAcrossLists, renderDragOverlay, children }) {
    // the id under the cursor right now, only used to render the floating preview
    const [draggedId, setDraggedId] = useState(null)
    // below 8px it stays a click and opens the task modal instead of starting a drag
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    )

    // fires while dragging, whenever the hovered target changes. Handing a list change
    // over here rather than waiting for the drop is what makes the target open a gap
    // under the cursor — otherwise the task only appears there once you let go
    const handleDragOver = ({ active, over }) => {
        if (!over || active.id === over.id) return
        onMoveAcrossLists?.(active.id, over.id)
    }

    const handleDragEnd = ({ active, over }) => {
        setDraggedId(null)
        // over is null when the drop lands outside any sortable
        if (!over || active.id === over.id) return
        onReorder(active.id, over.id)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={({ active }) => setDraggedId(active.id)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setDraggedId(null)}>
            {children}
            {/* follows the cursor on its own layer, so the preview stays put even when the
                lists underneath reset it — which is what makes a drop onto 'finished',
                where no live move happens, stop feeling chopped */}
            <DragOverlay>
                {draggedId != null ? renderDragOverlay?.(draggedId) : null}
            </DragOverlay>
        </DndContext>
    )
}
