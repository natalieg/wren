export default function DeleteFlag({ deleteEnabled, onClick, children }) {
   return (
      <div className='gradientHover rounded-md py-1 pl-1'>{children}
         <span className='ml-1 mr-2 cursor-pointer inline-block hover:scale-125 text-shadow-md hover:text-shadow-accent-soft transition duration-100'
            onClick={deleteEnabled ? onClick : undefined}>
            {deleteEnabled ? '✕' : ''}</span>
      </div>
   )
}
