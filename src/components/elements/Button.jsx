export default function Button({ label, onClick, className }) {
   return (
      <div onClick={onClick} className={`gradientHover rounded-md cursor-pointer border border-indigo-900/50 ${className}`}>
         {label}
      </div>
   )
}
