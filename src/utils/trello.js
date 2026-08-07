export const TRELLO_STORAGE_KEY = 'trelloCredentials'

// identifies the app "Wren" to Trello, not a person — it is the same for
// everyone and deliberately not a secret, exactly like every Power-Up ships
// its key in the browser. The per-person half is the token, which is why that
// one never gets committed and is asked for in the UI instead.
// app identity, shared by all users — not a secret
export const API_KEY = '6d3b754dfc44547c737dd8b7c9505ab8'

// hand this to anyone who should use the Trello page: they click allow and
// Trello hands them their own token to paste into Wren
export const AUTHORIZE_URL =
    `https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=Wren&key=${API_KEY}`

export const EMPTY_CREDENTIALS = {
    token: '',
    boardId: '',
}

// reads field by field rather than spreading the parsed object, so an older
// saved shape (which also carried an apiKey) drops its dead fields on load
// only known fields survive — older saves carried an apiKey too
export function loadCredentials() {
    try {
        const saved = localStorage.getItem(TRELLO_STORAGE_KEY)
        if (!saved) return EMPTY_CREDENTIALS

        const { token, boardId } = JSON.parse(saved)
        return { token: token ?? '', boardId: boardId ?? '' }
    } catch (e) {
        console.error('Failed to load Trello credentials from localStorage:', e)
        return EMPTY_CREDENTIALS
    }
}

export function saveCredentials(credentials) {
    localStorage.setItem(TRELLO_STORAGE_KEY, JSON.stringify(credentials))
}

export function hasCredentials({ token, boardId }) {
    return Boolean(token && boardId)
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
export async function fetchBoardLists({ token, boardId }) {
    const params = new URLSearchParams({
        cards: 'open',
        card_fields: 'name,due,shortUrl',
        fields: 'name',
        key: API_KEY,
        token,
    })

    const response = await fetch(`https://api.trello.com/1/boards/${boardId}/lists?${params}`)
    assertOk(response)

    return response.json()
}

// appends to the bottom of the list; callers reload the board afterwards
// instead of splicing the new card into state by hand
export async function createCard({ token }, { listId, name }) {
    const params = new URLSearchParams({
        idList: listId,
        name,
        pos: 'bottom',
        key: API_KEY,
        token,
    })

    const response = await fetch(`https://api.trello.com/1/cards?${params}`, { method: 'POST' })
    assertOk(response)

    return response.json()
}
