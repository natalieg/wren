import TaskItem from './TaskItem'

export default function TaskGroup({ tasks, toggleDone, toggleActive, onDelete, handleFieldChange, blockKeys, startTracking, stopTracking, runningTaskId, trackedSeconds, showEstimate, editingTaskId, setEditingTaskId }) {
    return (
        <div className='flex flex-col'>
            {tasks.map((t, index) => (
                <TaskItem key={t.id}
                    index={index}
                    task={t}
                    // task actions
                    toggleDone={toggleDone}
                    toggleActive={toggleActive}
                    onDelete={onDelete}
                    handleFieldChange={handleFieldChange}
                    startTracking={startTracking}
                    stopTracking={stopTracking}
                    // states from useTasks through Tasklist
                    runningTaskId={runningTaskId}
                    trackedSeconds={trackedSeconds}
                    editingTaskId={editingTaskId}
                    setEditingTaskId={setEditingTaskId}
                    // from Tasklist
                    blockKeys={blockKeys}
                    showEstimate={showEstimate}
                />
            ))}
        </div>
    )
}
