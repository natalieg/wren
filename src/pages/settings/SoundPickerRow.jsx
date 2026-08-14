import CheckboxRow from './CheckboxRow'
import PlayBtn from '../../components/elements/PlayBtn'
import { playSoundById } from '../../utils/playSound'

// A row with a label, optional checkbox, and a select for picking a sound
export default function SoundPickerRow({ id, label, value, options, onChange, enabled, onToggleEnabled }) {
  return (
    <div className='flex items-center justify-between gap-2'>
      {onToggleEnabled
        ? <CheckboxRow id={id} checked={enabled} onToggle={onToggleEnabled} label={label} />
        : <label htmlFor={id}>{label}</label>}
      <div className='flex items-center gap-1'>
        {options &&
          <select id={id} className='input p-1 w-32' value={value}
            onChange={(e) => onChange(e.target.value)}>
            {options.map(optionId => (
              <option key={optionId} value={optionId}>{optionId}</option>
            ))}
          </select>}
        <PlayBtn showAlways onClick={() => playSoundById(value)} />
      </div>
    </div>
  )
}
