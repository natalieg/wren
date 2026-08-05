import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import Input from '../elements/Input'

const TaskInput = forwardRef(function TaskInput({
    id,
    onSubmit,
    changeInputActive,
}, ref) {
    const [taskTime, setTaskTime] = useState(20)
    const [taskName, setTaskName] = useState('')
    const taskNameInputRef = useRef(null)

    const submit = () => {
        onSubmit(taskName, taskTime)
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
})

export default TaskInput
