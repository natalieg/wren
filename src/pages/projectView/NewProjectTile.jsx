import { useState, useRef } from 'react'
import Input from '../../components/elements/Input'

export default function NewProjectTile({ onCreate }) {
   const [name, setName] = useState('')
   const inputRef = useRef(null)

   const submit = () => {
      if (!name.trim()) return
      onCreate(name)
      setName('')
      inputRef.current?.focus()
   }

   const handleKeyDown = (e) => e.key === 'Enter' && submit()

   return (
      <div className='flex flex-col items-center justify-center gap-2 p-4 min-h-32 rounded-sm border-(length:--border-w-thick) border-dashed border-text-primary/40'>
         <Input ref={inputRef} placeholder='New project...' value={name}
            onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} width='w-48' />
         <span className='text-3xl text-text-primary/40'>+</span>
      </div>
   )
}
