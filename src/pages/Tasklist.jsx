import { useState, useRef } from 'react'
import Input from '../components/elements/Input'
import TaskGroup from '../components/tasks/TaskGroup'
import TaskEditModalBody from '../components/tasks/TaskEditModalBody'
import Modal from '../components/elements/Modal'
import CollapsableDiv from '../components/CollapsableDiv'
import useTasks from '../hooks/useTasks'
import TimeProgress from '../components/TimeProgress'
// HINT (background timer fix): swap the useTasks import/call below for
// `import { useTasksContext } from '../context/TasksContext'` once TasksProvider
// wraps <Routes> in App.jsx — that's what keeps this state alive when you
// navigate to /history or /project and back.

export default function Tasklist() {
    const [newTask, setNewTask] = useState('')
    const [editingTaskId, setEditingTaskId] = useState(null)
    const [taskTime, setTaskTime] = useState(20)
    // HINT: becomes `const { ... } = useTasksContext()` — newTask/taskTime stay
    // local to this component (they're just input-field state) and get passed
    // as real args to handleAddTask(newTask, taskTime) below instead, see the
    // handleKeyDown call a few lines down which already does this (today those
    // args are silently ignored by handleAddTask — see useTasks.js HINT).
    const { taskList, openTasks, inactiveTasks, finishedTasks, taskActions, startedAt, updateActionTime, runningTaskId, trackedSeconds } = useTasks(newTask, taskTime)
    const { handleAddTask, handleFieldChange, deleteAllFinishedTasks } = taskActions
    const editingTaskActive = taskList.find(t => t.id === editingTaskId)
    const [inputActive, setInputActive] = useState(false)

    const taskNameInputRef = useRef(null)

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddTask(newTask, taskTime)
            setNewTask('')
            setTaskTime(20)
            taskNameInputRef.current?.focus()
        }
    }

    const taskActionBundle = {
        ...taskActions,
        runningTaskId,
        trackedSeconds,
        blockKeys: inputActive,
        onEdit: setEditingTaskId,
    }

    const handleTaskTimeChange = (e) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value)) {
            setTaskTime(value)
        }
    }

    return (
        <div id='taskList' className='w-full lg:w-1/2 xl:w-[40%] min-w-150'>
            <p className='headerDark'>Tasks</p>
            <div className='flex flex-col gap-2 max-w-[95%] mx-auto'>
                <div id='inputArea' className='flex gap-2'>
                    <Input
                        ref={taskNameInputRef}
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setInputActive(true)}
                        onBlur={() => setInputActive(false)}
                    />
                    <Input
                        placeholder="Time"
                        type='number'
                        width='w-20'
                        value={taskTime}
                        onChange={handleTaskTimeChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setInputActive(true)}
                        onBlur={() => setInputActive(false)}
                    />
                </div>
                {/* Time display + Bar */}
                <TimeProgress openTasks={openTasks} finishedTasks={finishedTasks} startedAt={startedAt} />
                {/* 💤 Inactive Tasks */}
                {/* Todo move to side component when implemented */}
                {inactiveTasks.length > 0 && (
                    <CollapsableDiv
                        label={`Inactive tasks (${inactiveTasks.length})`}
                        collapseAction={updateActionTime}>
                        <TaskGroup tasks={inactiveTasks} {...taskActionBundle} />
                    </CollapsableDiv>
                )}
                {/* ⚡ Active Tasks */}
                <TaskGroup tasks={openTasks} {...taskActionBundle} />
                {/* ✅ Finished Tasks */}
                {finishedTasks.length > 0 && (
                    <CollapsableDiv
                        label={`Finished tasks (${finishedTasks.length})`}>
                        <TaskGroup tasks={finishedTasks} {...taskActionBundle} />
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
        </div>
    )
}
