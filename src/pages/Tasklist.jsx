import { useState, useRef } from 'react'
import Input from '../components/elements/Input'
import TaskGroup from '../components/tasks/TaskGroup'
import TaskEditModalBody from '../components/tasks/TaskEditModalBody'
import Modal from '../components/elements/Modal'
import Bar from '../components/elements/Bar'
import CollapsableDiv from '../components/CollapsableDiv'
import { formatTime } from '../utils/formatTime'
import useTasks from '../hooks/useTasks'

export default function Tasklist() {
    const [newTask, setNewTask] = useState('')
    const [editingTaskId, setEditingTaskId] = useState(null)
    const [taskTime, setTaskTime] = useState(20)
    const { taskList, openTasks, inactiveTasks, finishedTasks, taskActions } = useTasks(newTask, taskTime)
    const { handleAddTask, handleFieldChange, deleteAllFinishedTasks } = taskActions
    const editingTaskActive = taskList.find(t => t.id === editingTaskId)
    const [inputActive, setInputActive] = useState(false)

    const totalTimeLeft = taskList.reduce((sum, task) => {
        return !task.done ? sum + (parseInt(task.time) || 0) : sum;
    }, 0);

    const totalTimeDone = taskList.reduce((sum, task) => {
        return task.done ? sum + (parseInt(task.time) || 0) : sum;
    }, 0);

    const totalTimePlanned = totalTimeDone + totalTimeLeft;
    const donePercent = totalTimePlanned > 0 ? (totalTimeDone / totalTimePlanned) * 100 : 0;


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
        blockKeys: inputActive,
        onEdit: setEditingTaskId,
    }

    return (
        <div id='taskList'>
            <p className='headerDark'>Tasks</p>
            <div className='flex flex-col gap-2 max-w-md mx-auto'>
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
                        <TaskGroup tasks={inactiveTasks} {...taskActionBundle} />
                    </CollapsableDiv>
                )}
                {/* Active Tasks */}
                <TaskGroup tasks={openTasks} {...taskActionBundle} />
                {/* Finished Tasks */}
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
