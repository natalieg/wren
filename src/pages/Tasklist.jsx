import React, { useEffect, useState } from 'react'
import Input from '../components/elements/Input'
import TaskItem from '../components/TaskItem'
import Bar from '../components/elements/Bar'

// TODO evaluate if this should be seperated from the task handling - if 'tasking' should be
// it's own component
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
    const [finishedTasks, setFinishedTasks] = useState(() => tasks.filter(t => t.done).length)

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])

    const toggle = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
        setFinishedTasks(tasks.filter(t => t.id === id ? !t.done : t.done).length)
    }

    const handleAddTask = () => {
        if (newTask.trim() === '') return
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
        setTasks([...tasks, { id: newId, label: newTask, time: taskTime, done: false }])
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
        setFinishedTasks(tasks.filter(t => t.id !== id && t.done).length)
    }

    const deleteAllFinishedTasks = () => {
        setTasks(tasks.filter(t => !t.done))
        setFinishedTasks(0)
    }

    const formatTime = (minutes) => minutes >= 60 ? `${Math.floor(minutes / 60)}h${minutes % 60 ? minutes % 60 + 'm' : ''}` : `${minutes}m`;

    const totalTimeLeft = tasks.reduce((sum, task) => {
        return !task.done ? sum + parseInt(task.time) : sum;
    }, 0);

    const totalTimeDone = tasks.reduce((sum, task) => {
        return task.done ? sum + parseInt(task.time) : sum;
    }, 0);

    const totalTimePlanned = totalTimeDone + totalTimeLeft;
    const donePercent = totalTimePlanned > 0 ? (totalTimeDone / totalTimePlanned) * 100 : 0;

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
                    />
                    <Input
                        placeholder="Time"
                        width='w-20'
                        value={taskTime}
                        onChange={(e) => setTaskTime(parseInt(e.target.value))}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className='flex gap-4 items-center justify-center mt-2 mb-4'>
                    <div id='timePanel' className='select-none smallPanel self-start'>
                        <Bar percent={donePercent} color='success' />
                        <div className='flex items-center justify-between gap-4'>
                            <span className='text-xs font-semibold text-success'>{formatTime(totalTimeDone)} done</span>
                            <span className='text-xs font-semibold text-text-muted'>{formatTime(totalTimeLeft)} left</span>
                        </div>
                    </div>
                </div>
                {tasks?.map(t => (
                    <TaskItem key={t.id} task={t} onToggle={toggle} onDelete={handleDeleteTask} />
                ))}
                {/* TODO fix styling now that the real bg color is active */}
                <button id='deleteAllFinishedBtn'
                    className={`smallButton ${finishedTasks === 0 ? 'opacity-50 cursor-not-allowed noHover' : ''}`}
                    disabled={finishedTasks === 0}
                    onClick={deleteAllFinishedTasks}>
                    Delete all finished tasks</button>
            </div>
        </>
    )
}
