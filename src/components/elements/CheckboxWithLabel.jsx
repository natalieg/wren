
export default function CheckboxWithLabel({ onChange, checked, label, className }) {
   return (
      <label className={`flex space-x-1 ${className}`}>
         <input type="checkbox" onChange={onChange} checked={checked} />
         <span className='text-xs text-gray-700'>{label}</span>
      </label>
   )
}
