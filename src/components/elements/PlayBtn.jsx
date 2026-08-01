export default function PlayBtn({ id, onClick, showAlways = false, active }) {

    const handleClick = (e) => {
        e.stopPropagation()
        if (onClick) onClick()
    }

    return (
        <div id={id}
            className={`group select-none px-2 rounded-md text-text-muted 
                hover:text-text-secondary hover:bg-bg-base
                ${showAlways ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            onClick={(e) => handleClick(e)}>
            <span className=' group-hover:drop-shadow-glow-accent
                        hover:scale-150 text-md'>
                {active ? '⁛' : '⫸'}
            </span>
        </div>
    )
}
