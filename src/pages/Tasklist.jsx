import { useEffect, useState } from 'react'
import Input from '../components/elements/Input'
import TaskGroup from '../components/tasks/TaskGroup'
import TaskEditModalBody from '../components/tasks/TaskEditModalBody'
import Modal from '../components/elements/Modal'
import Bar from '../components/elements/Bar'
import CollapsableDiv from '../components/CollapsableDiv'
import { formatTime } from '../utils/formatTime'

export default function Tasklist() {
    const [newTask, setNewTask] = useState('')
    const [taskTime, setTaskTime] = useState(20) //todo define default time in settings
    const [tasks, setTasks] = useState(() => {
        try {
            const savedTasks = localStorage.getItem('tasks')
            return savedTasks ? JSON.parse(savedTasks) : []
        } catch (e) {
            console.error('Failed to load tasks from localStorage:', e)
            return []
        }
    })
    const [inputActive, setInputActive] = useState(false)

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])

    const toggleDone = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
    }

    const toggleActive = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, active: !t.active } : t))
    }

    const handleAddTask = () => {
        if (newTask.trim() === '') return
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
        setTasks([...tasks, { id: newId, label: newTask, time: taskTime, active: true, done: false }])
        setTaskTime(20)
        setNewTask('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddTask()
        }
    }

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id))
    }

    const deleteAllFinishedTasks = () => {
        setTasks(tasks.filter(t => !t.done))
    }

    const totalTimeLeft = tasks.reduce((sum, task) => {
        return !task.done ? sum + parseInt(task.time) : sum;
    }, 0);

    const totalTimeDone = tasks.reduce((sum, task) => {
        return task.done ? sum + parseInt(task.time) : sum;
    }, 0);

    const totalTimePlanned = totalTimeDone + totalTimeLeft;
    const donePercent = totalTimePlanned > 0 ? (totalTimeDone / totalTimePlanned) * 100 : 0;

    const openTasks = tasks.filter(t => !t.done && t.active)
    const inactiveTasks = tasks.filter(t => !t.done && !t.active)
    const finishedTasks = tasks.filter(t => t.done)

    const handleFieldChange = (id, field, value) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t))
    }

    const [editingTaskId, setEditingTaskId] = useState(null)
    const editingTaskActive = tasks.find(t => t.id === editingTaskId)

    const taskActions = { toggleDone, toggleActive, onDelete: handleDeleteTask, onEdit: setEditingTaskId, blockKeys: inputActive }

    return (
        <>
            <p className='headerDark'>Tasks</p>
            <div className='flex flex-col gap-2 max-w-md mx-auto'>
                <div id='inputArea' className='flex gap-2'>
                    <Input
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setInputActive(true)}
                        onBlur={() => setInputActive(false)}
                    />
                    <Input
                        placeholder="Time"
                        width='w-20'
                        value={taskTime}
                        onChange={(e) => setTaskTime(parseInt(e.target.value))}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setInputActive(true)}
                        onBlur={() => setInputActive(false)}
                    />
                </div>
                {/* Time display + Bar */}
                {/* Todo move to own component */}
                <div className='flex gap-4 items-center justify-center mt-2 mb-4'>
                    <div id='timePanel' className='select-none smallPanel self-start'>
                        <Bar percent={donePercent} color='success' />
                        <div className='flex items-center justify-between gap-4'>
                            <span className='text-xs font-semibold text-success'>{formatTime(totalTimeDone)} done</span>
                            <span className='text-xs font-semibold text-text-muted'>{formatTime(totalTimeLeft)} left</span>
                        </div>
                    </div>
                </div>
                {/* Inactive Tasks */}
                {/* Todo move to side component when implemented */}
                {inactiveTasks.length > 0 && (
                    <CollapsableDiv
                        label={`Inactive tasks (${inactiveTasks.length})`}>
                        <TaskGroup tasks={inactiveTasks} {...taskActions} />
                    </CollapsableDiv>
                )}
                {/* Active Tasks */}
                <TaskGroup tasks={openTasks} {...taskActions} />
                {/* Finished Tasks */}
                {finishedTasks.length > 0 && (
                    <CollapsableDiv
                        label={`Finished tasks (${finishedTasks.length})`}>
                        <TaskGroup tasks={finishedTasks} {...taskActions} />
                        <button id='deleteAllFinishedBtn'
                            className={`softButton mt-4 min-w-40 w-1/2 mx-auto block`}
                            disabled={finishedTasks.length === 0}
                            onClick={deleteAllFinishedTasks}>
                            Delete all finished tasks
                        </button>
                    </CollapsableDiv>
                )}
            </div>
            {editingTaskActive &&
                <Modal title='edit task' width='w-120' onClose={() => setEditingTaskId(null)}>
                    <TaskEditModalBody
                        task={editingTaskActive}
                        handleChange={handleFieldChange}
                        closeModal={() => setEditingTaskId(null)} />
                </Modal>
            }
        </>
    )
}
