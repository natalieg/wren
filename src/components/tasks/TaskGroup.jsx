import TaskItem from './TaskItem'

export default function TaskGroup({ tasks, toggleDone, toggleActive, onDelete, onEdit, blockKeys, startTracking, stopTracking, runningTaskId, trackedSeconds }) {
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
                    startTracking={startTracking}
                    stopTracking={stopTracking}
                    // states from useTasks through Tasklist
                    runningTaskId={runningTaskId}
                    trackedSeconds={trackedSeconds}
                    // from Tasklist
                    blockKeys={blockKeys}
                    onEdit={onEdit}
                />
            ))}
        </div>
    )
}
