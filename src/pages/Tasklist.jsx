import React, { useEffect, useState } from 'react'
import Input from '../components/elements/Input'
import TaskItem from '../components/TaskItem'

// TODO evaluate if this should be seperated from the task handling - if 'tasking' should be
// it's own component
export default function Tasklist() {
    const [newTask, setNewTask] = useState('')
    const [tasks, setTasks] = useState(() => {
        try {
            const savedTasks = localStorage.getItem('tasks')
            return savedTasks ? JSON.parse(savedTasks) : []
        } catch (e) {
            console.error('Failed to load tasks from localStorage:', e)
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])

    const toggle = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))

    const handleAddTask = () => {
        if (newTask.trim() === '') return
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
        setTasks([...tasks, { id: newId, label: newTask, done: false }])
        setNewTask('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddTask()
        }
    }

    return (
        <>
            <p className='header'>Today</p>
            <div className='flex flex-col gap-2 max-w-md mx-auto'>
                <Input
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {tasks?.map(t => (
                    <TaskItem key={t.id} task={t} onToggle={toggle} />
                ))}
            </div>
        </>
    )
}
