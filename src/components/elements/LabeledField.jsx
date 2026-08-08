import Input from './Input'
import { inputPadding } from './inputStyles'

// A labelled field. Normally renders a real Input; with `viewOnly` it renders the
// same value as a read-only badge instead, on identical box metrics so switching
// between the two doesn't shift the layout.
export default function LabeledField({
   id, label, value, viewOnly = false, onClick,
   placeholder, type = 'text', onChange, onKeyDown,
   width = 'w-full', padding, backgroundColor, slim = true, className = '',
}) {
   // a badge you can click is a button, not a div — otherwise it's unreachable by keyboard
   const ViewTag = onClick ? 'button' : 'span'

   return (
      <div className={width}>
         {/* htmlFor only when there actually is a control to focus */}
         <label htmlFor={viewOnly ? undefined : id}
            className='block text-xs text-text-secondary font-medium'>
            {label}
         </label>

         {viewOnly
            ? <ViewTag
               type={onClick ? 'button' : undefined}
               onClick={onClick}
               className={`input input-view ${slim ? 'input-slim' : ''} w-full
                  ${inputPadding(slim, padding)} ${onClick ? 'cursor-pointer' : ''} ${className}`}>
               {value}
            </ViewTag>
            : <Input
               id={id}
               type={type}
               placeholder={placeholder}
               value={value}
               onChange={onChange}
               onKeyDown={onKeyDown}
               padding={padding}
               backgroundColor={backgroundColor}
               slim={slim}
               className={className}
            />}
      </div>
   )
}
