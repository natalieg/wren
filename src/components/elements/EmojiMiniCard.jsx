export default function EmojiMiniCard({ id, title, subtitle, emoji, onClick, active = false, otherActive, activeBg = 'bg-gradient-success', success }) {

   const borderColor = active && success ? 'border-success/50' : (otherActive ? 'border-white' : 'border-yellow-600/50')
   const bgColor = active && success ? 'bg-gradient-success' : (active && !success ? 'bg-gradient-main' : 'bg-bg-base')

   return (
      <div id={id} onClick={onClick}
         className={`flex flex-col items-center justify-center gap-1 rounded-md p-2 cursor-pointer border ${borderColor} 
            ${active ? activeBg : bgColor}`}>
         <p className='text-shadow-md text-shadow-black/30 text-4xl'>{emoji}</p>
         <p className='font-retro'>{title}</p>
         <p className='font-retro'>{subtitle}</p>
      </div>
   )
}
