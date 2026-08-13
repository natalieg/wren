import Checkbox from '../../components/elements/Checkbox'

export default function CheckboxRow({ checked, onToggle, label, id, disabled = false }) {
  return (
    <div className='flex items-center gap-2'>
      <Checkbox id={id} checked={checked} onToggle={onToggle} disabled={disabled} />
      {/* htmlFor doesn't forward clicks — the target is a styled span, not a real form
          control, so the label needs its own handler to make the text clickable too */}
      <label htmlFor={id} onClick={() => !disabled && onToggle(id)}
        className={disabled ? 'opacity-60' : 'cursor-pointer'}>{label}</label>
    </div>
  )
}
