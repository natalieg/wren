import { useState, useEffect, useCallback } from 'react'
import { fetchBoardLists } from '../utils/trello'

/**
 * Loads the open lists (with their cards) of one board.
 * status: 'idle' — no credentials yet | 'loading' | 'ready' | 'error'
 */
function useTrelloBoard({ token, boardId }) {
    const [result, setResult] = useState({ requestId: null, lists: [], error: null })
    const [reloadCount, setReloadCount] = useState(0)

    const reload = useCallback(() => setReloadCount(count => count + 1), [])

    // identifies the request the current credentials ask for; comparing it to
    // the id the last response carried tells us whether we are still waiting,
    // so 'loading' never has to be written into state from inside the effect
    // null while credentials are incomplete
    const requestId = token && boardId
        ? `${token}|${boardId}|${reloadCount}`
        : null

    useEffect(() => {
        if (!requestId) return

        // a late response from previous credentials must not overwrite newer ones
        let cancelled = false

        fetchBoardLists({ token, boardId })
            .then(data => {
                if (!cancelled) setResult({ requestId, lists: data, error: null })
            })
            .catch(e => {
                if (!cancelled) setResult({ requestId, lists: [], error: e.message })
            })

        return () => { cancelled = true }
    }, [requestId, token, boardId])

    const status = !requestId ? 'idle'
        : result.requestId !== requestId ? 'loading'
            : result.error ? 'error' : 'ready'

    return { lists: result.lists, status, error: result.error, reload }
}

export default useTrelloBoard
