export default function SwitchTag({ label1, label2, onClick, active }) {
  // const [isActive, setIsActive] = useState(active)

  return (
    <div className={`${active ? 'bg-gradient-softer shadow-glow-accent' : 'bg-gradient-muted'} 
          rounded-pill w-fit
          px-2 py-1 text-sm cursor-pointer select-none`}
          onClick={onClick}>
      {active && <span className='font-bold'>{label1}</span>}
      {!active && <span>{label2}</span>}
    </div>
  )
}
