export default function EmojiMiniCard({ id, title, subtitle, emoji, onClick, active = false }) {
   return (
      <div id={id} onClick={onClick}
         className={`flex flex-col items-center justify-center gap-1 rounded-md p-2 cursor-pointer
            ${active ? 'bg-violet-300' : 'bg-violet-100 hover:bg-violet-300'}`}>
         <p className='text-4xl'>{emoji}</p>
         <p className='font-retro'>{title}</p>
         <p className='font-retro'>{subtitle}</p>
      </div>
   )
}
