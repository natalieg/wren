import TaskItem from './TaskItem'

export default function TaskGroup({ tasks, toggleDone, onDelete, startTracking, stopTracking, runningTaskId, trackedSeconds, showEstimate, setEditingTaskId }) {
    return (
        <div className='flex flex-col'>
            {tasks.map((t, index) => (
                <TaskItem key={t.id}
                    index={index}
                    task={t}
                    // task actions
                    toggleDone={toggleDone}
                    onDelete={onDelete}
                    startTracking={startTracking}
                    stopTracking={stopTracking}
                    // states from useTasks through Tasklist
                    runningTaskId={runningTaskId}
                    trackedSeconds={trackedSeconds}
                    setEditingTaskId={setEditingTaskId}
                    // from Tasklist
                    showEstimate={showEstimate}
                />
            ))}
        </div>
    )
}
