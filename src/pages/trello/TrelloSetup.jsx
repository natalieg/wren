import { useState } from 'react'
import PropTypes from 'prop-types'
import Input from '../../components/elements/Input'
import { hasCredentials, parseBoardId, AUTHORIZE_URL } from '../../utils/trello'

const FIELDS = [
  { name: 'token', label: 'Token', type: 'password' },
  { name: 'boardId', label: 'Board-ID oder Board-URL', type: 'text' },
]

export default function TrelloSetup({ credentials, onSave }) {
  const [draft, setDraft] = useState(credentials)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave({ ...draft, boardId: parseBoardId(draft.boardId) })
  }

  return (
    <details open={!hasCredentials(credentials)} className='mb-6'>
      <summary className='text-text-muted text-sm cursor-pointer'>Zugangsdaten</summary>

      <form onSubmit={handleSubmit} className='flex flex-col gap-2 pt-2'>
        {FIELDS.map(field => (
          <label key={field.name} className='flex flex-col gap-1 text-text-muted text-sm'>
            {field.label}
            <Input
              id={`trello-${field.name}`}
              type={field.type}
              value={draft[field.name]}
              onChange={e => setDraft({ ...draft, [field.name]: e.target.value })}
            />
          </label>
        ))}

        <button type='submit'
          className='self-start px-3 py-1 text-sm text-text-primary border rounded-md cursor-pointer'>
          Speichern
        </button>

        <p className='text-text-muted text-xs'>
          Noch kein Token?{' '}
          <a href={AUTHORIZE_URL} target='_blank' rel='noreferrer' className='underline'>
            Bei Trello holen
          </a>
          {' '}— erlauben klicken, Token kopieren, hier einfügen.
        </p>
        <p className='text-text-muted text-xs'>
          Bleibt nur in diesem Browser (localStorage) und wird nie mitgeschickt außer an Trello.
        </p>
      </form>
    </details>
  )
}

TrelloSetup.propTypes = {
  credentials: PropTypes.shape({
    token: PropTypes.string,
    boardId: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
}
