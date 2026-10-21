import { Link } from 'react-router-dom'
import flower from '../../assets/img/lovely/flower-poppy.webp'

// the little flower in the corner that switches to the lovely list
export default function LovelyLink() {
   return (
      <Link to='/lovely' title='lovely list' aria-label='open the lovely list'
         className='absolute top-4 right-6 softTransition hover:scale-110 hover:rotate-6'>
         <img src={flower} alt='' className='h-14 w-auto rotate-12' />
      </Link>
   )
}
