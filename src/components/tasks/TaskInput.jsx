import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import Input from '../elements/Input'

const TaskInput = forwardRef(function TaskInput({
    id, width, onSubmit, showPlacement = false }, ref) {
    const [taskTime, setTaskTime] = useState(20)
    const [taskName, setTaskName] = useState('')
    // ↑ adds the new task to the top of the list, ↓ to the bottom
    const [atTop, setAtTop] = useState(false)
    const taskNameInputRef = useRef(null)

    const submit = () => {
        onSubmit(taskName, taskTime, { atTop })
        setTaskName('')
        setTaskTime(20)
        taskNameInputRef.current?.focus()
    }

    // lets siblings (e.g. MultiSwitchFlag's Enter handler) trigger a submit
    // without needing to know taskName/taskTime — that state stays private here
    useImperativeHandle(ref, () => ({ submit }))

    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') return
        submit()
    }

    const handleTaskTimeChange = (e) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value)) {
            setTaskTime(value)
        }
    }

    return (
        <div id={`inputArea_${id}`} className='flex gap-2 w-full items-center'>
            {showPlacement &&
                <button type='button'
                    className='text-text-muted hover:text-text-primary w-6 shrink-0 select-none'
                    title={atTop ? 'Adding to top' : 'Adding to bottom'}
                    onClick={() => { setAtTop(!atTop); taskNameInputRef.current?.focus() }}>
                    {atTop ? '↑' : '↓'}
                </button>}
            <Input
                ref={taskNameInputRef}
                placeholder="Add a new task..."
                width={width}
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Input
                placeholder="Time"
                type='number'
                width='w-20'
                value={taskTime}
                onChange={handleTaskTimeChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
})

export default TaskInput
