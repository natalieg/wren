import { useState } from 'react'
import PropTypes from 'prop-types'
import Input from '../../components/elements/Input'

export default function TrelloCardInput({ id, onSubmit }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || busy) return

    setBusy(true)
    setError(null)

    try {
      await onSubmit(trimmed)
      setName('')
    } catch (e) {
      // the card stays in the field on failure so nothing typed is lost
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='mt-1'>
      <Input
        id={`trello-new-card-${id}`}
        placeholder={busy ? '…' : '+ Karte'}
        value={name}
        padding='px-2 py-1'
        onChange={e => setName(e.target.value)}
      />
      {error && <p className='text-text-muted text-xs mt-1'>{error}</p>}
    </form>
  )
}

TrelloCardInput.propTypes = {
  id: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
