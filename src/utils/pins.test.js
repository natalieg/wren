import { describe, it, expect } from 'vitest'
import { clearStalePins } from './pins'
import { ACTIVE, BACKLOG, DONE } from './constants'

const NOW = new Date('2026-08-10T12:00:00.000Z').getTime()
const yesterday = new Date(NOW - 24 * 60 * 60 * 1000).toISOString()
const today = new Date(NOW).toISOString()

describe('clearStalePins', () => {
   it('removes a pin from another day and keeps the old time in the notes', () => {
      const [task] = clearStalePins([{ id: 1, list: ACTIVE, fixedStart: yesterday, notes: 'agenda' }], NOW)

      expect(task.fixedStart).toBeUndefined()
      expect(task.notes).toMatch(/^agenda\n📌 was pinned to \d\d:\d\d on /)
   })

   it('starts the notes when there were none', () => {
      const [task] = clearStalePins([{ id: 1, list: BACKLOG, fixedStart: yesterday }], NOW)

      expect(task.notes).toMatch(/^📌 was pinned to/)
   })

   it('leaves todays pins, finished tasks and unpinned tasks untouched', () => {
      const tasks = [
         { id: 1, list: ACTIVE, fixedStart: today },
         { id: 2, list: DONE, fixedStart: yesterday },
         { id: 3, list: ACTIVE },
      ]

      expect(clearStalePins(tasks, NOW)).toEqual(tasks)
   })

   it('drops a habits dated pin silently, its daily time still pins it', () => {
      const [task] = clearStalePins([{
         id: 1, list: ACTIVE, fixedStart: yesterday, notes: '',
         recurring: { active: true, id: 'h1', fixedTime: '14:00' },
      }], NOW)

      expect(task.fixedStart).toBeUndefined()
      expect(task.notes).toBe('')
      expect(task.recurring.fixedTime).toBe('14:00')
   })
})
