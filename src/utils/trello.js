export const TRELLO_STORAGE_KEY = 'trelloCredentials'

export const EMPTY_CREDENTIALS = {
    apiKey: '',
    token: '',
    boardId: '',
}

// key and token live in localStorage only — they are personal credentials and
// must never end up in the repo, so there is no default value to fall back on
// no defaults here on purpose: credentials are per-person, never committed
export function loadCredentials() {
    try {
        const saved = localStorage.getItem(TRELLO_STORAGE_KEY)
        return saved ? { ...EMPTY_CREDENTIALS, ...JSON.parse(saved) } : EMPTY_CREDENTIALS
    } catch (e) {
        console.error('Failed to load Trello credentials from localStorage:', e)
        return EMPTY_CREDENTIALS
    }
}

export function saveCredentials(credentials) {
    localStorage.setItem(TRELLO_STORAGE_KEY, JSON.stringify(credentials))
}

export function hasCredentials({ apiKey, token, boardId }) {
    return Boolean(apiKey && token && boardId)
}

// a full board URL (trello.com/b/IWBbpRCV/wren) carries the id in its second
// path segment, so pasting the URL straight from the browser works too
// accepts a board URL or a bare id
export function parseBoardId(input) {
    const match = input.trim().match(/trello\.com\/b\/([^/?#]+)/)
    return match ? match[1] : input.trim()
}

// Trello answers a token that lacks the needed scope with the same 401 it uses
// for a wrong token, so the message has to cover both cases at once
// 401 means either wrong token or missing write scope
function assertOk(response) {
    if (response.ok) return
    if (response.status === 401) {
        throw new Error('Token wird abgelehnt — falsch, oder ohne Schreibrechte erzeugt.')
    }
    if (response.status === 404) throw new Error('Nicht gefunden — stimmt die Board-ID?')
    throw new Error(`Trello antwortet mit ${response.status}.`)
}

// one request returns every open list with its open cards already nested,
// so rendering the whole board needs no follow-up calls per list
// single call — lists come back with their cards inside
export async function fetchBoardLists({ apiKey, token, boardId }) {
    const params = new URLSearchParams({
        cards: 'open',
        card_fields: 'name,due,shortUrl',
        fields: 'name',
        key: apiKey,
        token,
    })

    const response = await fetch(`https://api.trello.com/1/boards/${boardId}/lists?${params}`)
    assertOk(response)

    return response.json()
}

// appends to the bottom of the list; callers reload the board afterwards
// instead of splicing the new card into state by hand
export async function createCard({ apiKey, token }, { listId, name }) {
    const params = new URLSearchParams({
        idList: listId,
        name,
        pos: 'bottom',
        key: apiKey,
        token,
    })

    const response = await fetch(`https://api.trello.com/1/cards?${params}`, { method: 'POST' })
    assertOk(response)

    return response.json()
}
