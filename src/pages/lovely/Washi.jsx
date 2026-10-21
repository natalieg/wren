import washiMoths from '../../assets/img/lovely/washi-moths.webp'
import washiGold from '../../assets/img/lovely/washi-gold.webp'
import washiBlue from '../../assets/img/lovely/washi-blue.webp'

const WASHI = { moths: washiMoths, gold: washiGold, blue: washiBlue }

// a strip of tape: the design repeats along it, softened to pastel, with torn ends
export default function Washi({ tape = 'moths', className = '' }) {
   return (
      <div aria-hidden='true'
         className={`absolute washi-edge pastel opacity-90 pointer-events-none ${className}`}
         style={{ backgroundImage: `url(${WASHI[tape]})`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x' }} />
   )
}
