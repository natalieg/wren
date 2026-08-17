import { describe, it, expect, beforeEach, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { importData } from './backup'

const validBackup = (overrides = {}) => ({
   tasks: [],
   history: [],
   settings: { rolloverHour: 4 },
   ...overrides,
})

const backupFile = (data) => new File([JSON.stringify(data)], 'backup.json', { type: 'application/json' })

describe('importData', () => {
   beforeEach(() => {
      localStorage.clear()
      vi.stubGlobal('confirm', vi.fn(() => true))
      vi.stubGlobal('alert', vi.fn())
      vi.stubGlobal('location', { ...window.location, reload: vi.fn() })
   })

   it('writes every present backup key into localStorage', async () => {
      const data = validBackup({ startedAt: '2026-08-07T10:00:00.000Z' })
      importData(backupFile(data))

      await waitFor(() => expect(localStorage.getItem('tasks')).not.toBeNull())

      expect(JSON.parse(localStorage.getItem('history'))).toEqual(data.history)
      expect(JSON.parse(localStorage.getItem('settings'))).toEqual(data.settings)
      expect(JSON.parse(localStorage.getItem('startedAt'))).toEqual(data.startedAt)
      expect(window.location.reload).toHaveBeenCalled()
   })

   it('ignores keys in the file that are not part of BACKUP_KEYS', async () => {
      importData(backupFile(validBackup({ notARealKey: 'sneaky' })))

      await waitFor(() => expect(localStorage.getItem('tasks')).not.toBeNull())
      expect(localStorage.getItem('notARealKey')).toBeNull()
   })

   it('does not touch localStorage or reload when the user cancels the confirm', async () => {
      confirm.mockReturnValue(false)
      importData(backupFile(validBackup()))

      await waitFor(() => expect(confirm).toHaveBeenCalled())
      expect(localStorage.getItem('tasks')).toBeNull()
      expect(window.location.reload).not.toHaveBeenCalled()
   })

   it('rejects a backup missing a core key', async () => {
      const data = validBackup()
      delete data.settings
      importData(backupFile(data))

      await waitFor(() => expect(alert).toHaveBeenCalled())
      expect(localStorage.getItem('tasks')).toBeNull()
   })

   it('rejects a backup where tasks is not an array', async () => {
      importData(backupFile(validBackup({ tasks: 'not an array' })))

      await waitFor(() => expect(alert).toHaveBeenCalled())
      expect(localStorage.getItem('tasks')).toBeNull()
   })

   it('rejects a file that is not valid JSON', async () => {
      importData(new File(['not json'], 'backup.json', { type: 'application/json' }))

      await waitFor(() => expect(alert).toHaveBeenCalled())
      expect(localStorage.getItem('tasks')).toBeNull()
   })

   it('does nothing when called without a file', () => {
      importData(null)
      expect(alert).not.toHaveBeenCalled()
   })
})
