export default function EmojiMiniCard({ id, title, emoji, onClick }) {
   return (
      <div id={id} onClick={onClick}
         className='bg-violet-100 flex flex-col items-center justify-center gap-1 rounded-md p-2 cursor-pointer hover:bg-violet-300'>
         <p className='text-4xl'>{emoji}</p>
         <p className='font-retro'>{title}</p>
      </div>
   )
}
