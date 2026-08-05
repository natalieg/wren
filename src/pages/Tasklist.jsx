import { useState, useContext } from 'react'
import TaskGroup from '../components/tasks/TaskGroup'
import TaskEditModalBody from '../components/tasks/TaskEditModalBody'
import Modal from '../components/elements/Modal'
import CollapsableDiv from '../components/CollapsableDiv'
import TimeProgress from '../components/TimeProgress'
import TasksContext from '../context/TasksContext'
import TaskInput from '../components/tasks/TaskInput'

export default function Tasklist() {
    const [editingTaskId, setEditingTaskId] = useState(null)
    const {
        taskList,
        openTasks,
        nextUpTasks,
        finishedTasks,
        taskActions,
        startedAt,
        updateActionTime,
        runningTaskId,
        trackedSeconds
    } = useContext(TasksContext)

    const { handleAddTask, handleFieldChange, deleteAllFinishedTasks } = taskActions
    const editingTaskActive = taskList.find(t => t.id === editingTaskId)
    const [inputActive, setInputActive] = useState(false)

    const taskActionBundle = {
        ...taskActions,
        runningTaskId,
        trackedSeconds,
        blockKeys: inputActive,
        onEdit: setEditingTaskId,
    }

    return (
        <div id='taskList' className='w-full lg:w-1/2 xl:w-[40%] min-w-150'>
            <p className='headerDark'>Tasks</p>
            <div className='flex flex-col gap-2 max-w-[95%] mx-auto'>
                <TaskInput
                    id='main'
                    onSubmit={handleAddTask}
                    changeInputActive={setInputActive}
                />
                {/* Time display + Bar */}
                <TimeProgress openTasks={openTasks} finishedTasks={finishedTasks} startedAt={startedAt} />
                {/* 💤 Next up (backlog, 'nextUp' bucket) */}
                {/* Todo move to side component when implemented */}
                {nextUpTasks.length > 0 && (
                    <CollapsableDiv
                        label={`Next up (${nextUpTasks.length})`}
                        collapseAction={updateActionTime}>
                        <TaskGroup tasks={nextUpTasks} {...taskActionBundle} showEstimate={true} />
                    </CollapsableDiv>
                )}
                {/* ⚡ Active Tasks */}
                <TaskGroup tasks={openTasks} {...taskActionBundle} showEstimate={true} />
                {/* ✅ Finished Tasks */}
                {finishedTasks.length > 0 && (
                    <CollapsableDiv
                        label={`Finished tasks (${finishedTasks.length})`}>
                        <TaskGroup tasks={finishedTasks} {...taskActionBundle} showEstimate={true} />
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
                        toggleDone={taskActions.toggleDone}
                        toggleActive={taskActions.toggleActive}
                        closeModal={() => setEditingTaskId(null)} />
                </Modal>
            }
        </div>
    )
}
