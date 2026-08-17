import DocWrapper from '../../components/DocWrapper'
import useHistoryContext from '../../hooks/useHistoryContext'
import DayEntry from './DayEntry'

export default function History() {
   const { history } = useHistoryContext()

   return (
      <DocWrapper header='History'>
         <div className='w-full flex flex-col justify-center items-center gap-4'>
            {history.map(entry => (
               <DayEntry key={entry.date} entry={entry} />
            ))}
         </div>
      </DocWrapper>
   )
}
