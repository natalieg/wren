import Input from '../elements/Input'
import Textarea from '../elements/Textarea'
import Checkbox from '../elements/Checkbox'
import SwitchTag from '../elements/SwitchTag'
import MultiSwitchFlag from '../elements/MultiSwitchFlag'
import { bucketOptions } from '../../utils/buckets'
import { DONE, ACTIVE, BACKLOG } from '../../utils/constants'

export default function TaskEditModalBody({ task, handleChange, toggleDone, toggleActive, closeModal }) {
    const { id, label, time } = task
    const done = task.list === DONE
    const isBacklog = task.list === BACKLOG

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            closeModal()
        }
    }
    return (

        <div id={`taskEditModalBody_${id}`} className='flex gap-2'>
            <div className='pt-8'>
                <Checkbox id={id} onToggle={() => toggleDone(id)} checked={done} />
            </div>
            <div className='flex flex-col gap-2 w-full'>
                {/* Active/Inactive Tag + bucket, only relevant once parked */}
                <div className='pl-4 -mt-1 flex gap-2 items-center'>
                    {/* active/inactive */}
                    <SwitchTag label1='active' label2='inactive'
                        onClick={() => toggleActive(id)}
                        active={task.list === ACTIVE} />
                        {/* bucket [next up, next week, someday...] */}
                    {isBacklog &&
                        <MultiSwitchFlag options={bucketOptions} value={task.backlog?.bucket} width='w-28'
                            onChange={(bucket) => handleChange(id, BACKLOG, { ...task.backlog, bucket })} />}
                </div>
                <div className='flex gap-2 items-start'>
                    <div className='pt-2'>
                    </div>
                    <Textarea
                        placeholder="Task description"
                        value={label}
                        onChange={(e) => handleChange(id, 'label', e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Input
                        placeholder="Time"
                        type="number"
                        width='w-20'
                        value={time}
                        onChange={(e) => handleChange(id, 'time', parseInt(e.target.value))}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>
        </div>
    )
}
