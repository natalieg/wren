import { useState, useRef } from 'react'
import Input from '../elements/Input'

export default function TaskInput({
    id,
    onSubmit,
    changeInputActive,
}) {
    const [taskTime, setTaskTime] = useState(20)
    const [taskName, setTaskName] = useState('')
    const taskNameInputRef = useRef(null)

    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') return
        onSubmit(taskName, taskTime)
        setTaskName('')
        setTaskTime(20)
        taskNameInputRef.current?.focus()
    }

    const handleTaskTimeChange = (e) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value)) {
            setTaskTime(value)
        }
    }

    return (
        <div id={`inputArea_${id}`} className='flex gap-2'>
            <Input
                ref={taskNameInputRef}
                placeholder="Add a new task..."
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => changeInputActive(true)}
                onBlur={() => changeInputActive(false)}
            />
            <Input
                placeholder="Time"
                type='number'
                width='w-20'
                value={taskTime}
                onChange={handleTaskTimeChange}
                onKeyDown={handleKeyDown}
                onFocus={() => changeInputActive(true)}
                onBlur={() => changeInputActive(false)}
            />
        </div>
    )
}
