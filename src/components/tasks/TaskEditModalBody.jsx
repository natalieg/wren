import Input from '../elements/Input'
import Textarea from '../elements/Textarea'
import Checkbox from '../elements/Checkbox'
import SwitchTag from '../elements/SwitchTag'

export default function TaskEditModalBody({ task, handleChange, closeModal }) {
    const { id, label, time, done } = task

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            closeModal()
        }
    }
    return (

        <div id={`taskEditModalBody_${id}`} className='flex gap-2'>
            <div className='pt-8'>
                <Checkbox id={id} onToggle={() => handleChange(id, 'done', !done)} checked={done} />
            </div>
            <div className='flex flex-col gap-2 w-full'>
                {/* Active/Inactive Tag */}
                <div className='pl-4 -mt-1'>
                    <SwitchTag label1='active' label2='inactive'
                        onClick={() => handleChange(id, 'active', !task.active)}
                        active={task.active} />
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
