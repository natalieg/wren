import { useState } from 'react'
import DocWrapper from '../../components/DocWrapper'
import TrelloSetup from './TrelloSetup'
import TrelloList from './TrelloList'
import useTrelloBoard from '../../hooks/useTrelloBoard'
import { loadCredentials, saveCredentials, createCard } from '../../utils/trello'

export default function Trello() {
  const [credentials, setCredentials] = useState(loadCredentials)
  const { lists, status, error, reload } = useTrelloBoard(credentials)

  const handleSave = (next) => {
    saveCredentials(next)
    setCredentials(next)
  }

  // no optimistic insert: one reload costs a single request and keeps the
  // board honest about what Trello actually stored, including other people's edits
  // write, then reload — the board stays the single source of truth
  const handleCreateCard = async (listId, name) => {
    await createCard(credentials, { listId, name })
    reload()
  }

  return (
    <DocWrapper header='Trello' className='w-full lg:w-1/2 xl:w-[40%] min-w-150 mx-auto'>
      <TrelloSetup credentials={credentials} onSave={handleSave} />

      {status === 'idle' &&
        <p className='text-text-muted'>Trag Key, Token und Board oben ein.</p>}

      {status === 'loading' &&
        <p className='text-text-muted'>Lade Board …</p>}

      {status === 'error' &&
        <p className='text-text-muted'>
          {error}{' '}
          <button type='button' onClick={reload} className='underline cursor-pointer'>
            Nochmal
          </button>
        </p>}

      {status === 'ready' && <>
        <button type='button' onClick={reload}
          className='text-text-muted text-sm underline cursor-pointer mb-4'>
          Aktualisieren
        </button>
        <div className='flex gap-4'>
          {lists.map(list =>
            <TrelloList key={list.id} list={list} onCreateCard={handleCreateCard} />)}
        </div>
      </>}
    </DocWrapper>
  )
}
