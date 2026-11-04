import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useProjects from './useProjects'

// simulates the event a browser fires in this tab when another tab writes localStorage
const writeFromOtherTab = (key, value) => {
   const newValue = JSON.stringify(value)
   localStorage.setItem(key, newValue)
   window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea: localStorage }))
}

describe('useProjects cross-tab sync', () => {
   beforeEach(() => localStorage.clear())

   it('picks up projects another tab created', () => {
      const { result } = renderHook(() => useProjects())
      act(() => writeFromOtherTab('projects', [{ id: 'p1', name: 'from tab A' }]))
      expect(result.current.projects).toEqual([{ id: 'p1', name: 'from tab A' }])
   })

   it('does not wipe the other tab\'s project when editing afterwards', () => {
      const { result } = renderHook(() => useProjects())
      act(() => writeFromOtherTab('projects', [{ id: 'p1', name: 'from tab A' }]))
      act(() => { result.current.addProject('from tab B') })
      const saved = JSON.parse(localStorage.getItem('projects'))
      expect(saved.map(p => p.name)).toEqual(['from tab A', 'from tab B'])
   })

   it('ignores other keys and cleared storage', () => {
      const { result } = renderHook(() => useProjects())
      act(() => { result.current.addProject('mine') })
      act(() => writeFromOtherTab('tasks', []))
      act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'projects', newValue: null, storageArea: localStorage })))
      expect(result.current.projects.map(p => p.name)).toEqual(['mine'])
   })
})
