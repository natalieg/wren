import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import BlockInput from './BlockInput'
import ProjectsContext from '../../../context/ProjectsContext'

// no `globals: true` in vite.config.js, so RTL can't register its own auto-cleanup
afterEach(cleanup)

function setup() {
   const onSubmit = vi.fn()
   const { container } = render(
      <ProjectsContext.Provider value={{ projects: [] }}>
         <BlockInput onSubmit={onSubmit} />
      </ProjectsContext.Provider>
   )
   const [name, hours] = container.querySelectorAll('input')
   fireEvent.change(name, { target: { value: 'Drawing' } })
   return { onSubmit, hours }
}

describe('BlockInput — hours field', () => {
   it('keeps "1." while typing instead of dropping the dot', () => {
      // regression guard: "1." used to snap back to "1", so typing 1.5 became 15
      const { hours } = setup()
      fireEvent.change(hours, { target: { value: '1.' } })
      expect(hours.value).toBe('1.')
   })

   it('submits 1.5 and 1,5 as 90 minutes', () => {
      for (const typed of ['1.5', '1,5']) {
         const { onSubmit, hours } = setup()
         fireEvent.change(hours, { target: { value: typed } })
         fireEvent.keyDown(hours, { key: 'Enter' })
         expect(onSubmit).toHaveBeenCalledWith(undefined, 'Drawing', 90, { atTop: false })
         cleanup()
      }
   })

   it('clamps to half an hour and falls back to the default on nonsense', () => {
      const { onSubmit, hours } = setup()
      fireEvent.change(hours, { target: { value: '0.1' } })
      fireEvent.keyDown(hours, { key: 'Enter' })
      expect(onSubmit).toHaveBeenLastCalledWith(undefined, 'Drawing', 30, { atTop: false })

      const second = setup()
      fireEvent.change(second.hours, { target: { value: 'abc' } })
      fireEvent.keyDown(second.hours, { key: 'Enter' })
      expect(second.onSubmit).toHaveBeenLastCalledWith(undefined, 'Drawing', 120, { atTop: false })
   })

   it('steps in half hours with the arrow keys, never below half an hour', () => {
      const { hours } = setup()
      fireEvent.keyDown(hours, { key: 'ArrowUp' })
      expect(hours.value).toBe('2.5')
      fireEvent.change(hours, { target: { value: '0,5' } })
      fireEvent.keyDown(hours, { key: 'ArrowDown' })
      expect(hours.value).toBe('0.5')
   })
})
