import { useState } from 'react'

// little things to grab when the day runs empty — click one to pull it into today
export default function Shortlist({ shortlist, onAdd, onRemove, onPick }) {
   const [draft, setDraft] = useState('')

   const submit = (e) => {
      e.preventDefault()
      onAdd(draft)
      setDraft('')
   }

   return (
      <section className='relative hand-box border-2 border-dashed border-[#d9c9ea] px-4 py-3 rotate-1'>
         <h2 className='font-hand text-2xl font-bold text-[#6b5486]'>little things</h2>
         <p className='text-xs text-text-muted mb-1'>small stuff for when the day runs empty. click one to do it today</p>
         <ul className='flex flex-col'>
            {shortlist.map(item =>
               <li key={item.id} className='group flex items-center gap-2'>
                  <button type='button' onClick={() => onPick(item)} title='pull into today'
                     className='flex-1 text-left font-hand text-xl text-text-secondary cursor-pointer hover:text-[#8a63c9] truncate'>
                     <span className='text-[#c9b8db] mr-1'>◦</span>{item.label}
                  </button>
                  <button type='button' onClick={() => onRemove(item.id)} aria-label={`remove ${item.label}`}
                     className='opacity-0 group-hover:opacity-100 text-text-muted hover:text-text-secondary cursor-pointer'>✕</button>
               </li>)}
         </ul>
         <form onSubmit={submit}>
            <label htmlFor='shortlistInput' className='sr-only'>add a little thing</label>
            <input id='shortlistInput' value={draft} onChange={(e) => setDraft(e.target.value)}
               placeholder='+ jot something down…'
               className='w-full mt-1 bg-transparent border-b border-dashed border-[#d9c9ea] font-hand text-xl text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-[#a56bff]' />
         </form>
      </section>
   )
}
