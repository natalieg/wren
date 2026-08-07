import Checkbox from '../../components/elements/Checkbox'

export default function CheckboxRow({ checked, onToggle, label, id }) {
  return (
    <div className='flex items-center gap-2'>
      <Checkbox id={id} checked={checked} onToggle={onToggle} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}
