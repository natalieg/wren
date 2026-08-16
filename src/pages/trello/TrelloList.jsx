import PropTypes from 'prop-types'
import TrelloCardInput from './TrelloCardInput'
import { formatDate } from '../../utils/formatTime'
import CollapsableDiv from '../../components/CollapsableDiv'

export default function TrelloList({ list, onCreateCard }) {
   const cards = list.cards ?? []

   return (
      <div className='mb-4 w-40'>
         <h3 className='text-text-primary font-semibold'>
            {list.name} <span className='text-text-muted font-normal'></span>
         </h3>
         <CollapsableDiv label={cards.length}>
            {cards.length === 0
               ? <p className='text-text-muted text-sm pl-4'>—</p>
               : <ul className=''>
                  {cards.map(card => (
                     <li key={card.id} className='text-text-primary text-sm py-0.5 task-item task-border task-hover my-1'>
                        <a href={card.shortUrl} target='_blank' rel='noreferrer' className='hover:underline'>
                           {card.name}
                        </a>
                        {card.due &&
                           <span className='text-text-muted ml-2'>
                              {formatDate(card.due)}
                           </span>}
                     </li>
                  ))}
               </ul>}
         </CollapsableDiv>
         <TrelloCardInput id={list.id} onSubmit={name => onCreateCard(list.id, name)} />
      </div>
   )
}

TrelloList.propTypes = {
   list: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      cards: PropTypes.array,
   }).isRequired,
   onCreateCard: PropTypes.func.isRequired,
}
