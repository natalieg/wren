import TaskItem from './TaskItem'

export default function TaskGroup({ tasks, toggleDone, toggleActive, onDelete, onEdit, blockKeys }) {
    return (
        <div className='flex flex-col gap-2'>
            {tasks.map(t => (
                <TaskItem key={t.id} task={t}
                    toggleDone={toggleDone}
                    toggleActive={toggleActive}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    blockKeys={blockKeys} />
            ))}
        </div>
    )
}
