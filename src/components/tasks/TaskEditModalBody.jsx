import Input from '../elements/Input'
import Textarea from '../elements/Textarea'
import Checkbox from '../elements/Checkbox'

export default function TaskEditModalBody({ task, handleChange, closeModal }) {
    const { id, label, time, done } = task

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            closeModal()
        }
    }
    return (
        <div id={`taskEditModalBody_${id}`} className='flex gap-2 items-start'>
            <div className='pt-2'>
                <Checkbox id={id} onToggle={() => handleChange(id, 'done', !done)} checked={done} />
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
    )
}
