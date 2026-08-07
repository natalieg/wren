import Input from '../../components/elements/Input'

// time fields need more room than number ones — HH:MM plus the browser's clock icon
// doesn't fit in w-20 and silently clips the minutes segment
export default function InputRow({ label, value, onChange, id, type = 'number', width = 'w-22', step, className = '' }) {
  return (
    <div className='flex items-center justify-between gap-2'>
      <label htmlFor={id}>{label}</label>
      <Input id={id} type={type} width={width} step={step}
        value={value}
        onChange={onChange}
        padding={'p-1'}
        className={`${className} text-right`} />
    </div>
  )
}
