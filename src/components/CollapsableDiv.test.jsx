import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
import CollapsableDiv from './CollapsableDiv'

afterEach(cleanup)

describe('CollapsableDiv', () => {
   it('starts collapsed by default and opens on click', () => {
      const { container } = render(<CollapsableDiv label='Section'><p>content</p></CollapsableDiv>)

      expect(container.querySelector('.grid').style.gridTemplateRows).toBe('0fr')
      fireEvent.click(container.querySelector('.cursor-pointer'))
      expect(container.querySelector('.grid').style.gridTemplateRows).toBe('1fr')
   })

   it('starts open when defaultOpen is set', () => {
      const { container } = render(<CollapsableDiv label='Section' defaultOpen><p>content</p></CollapsableDiv>)
      expect(container.querySelector('.grid').style.gridTemplateRows).toBe('1fr')
   })

   it('fires collapseAction only on the transition from collapsed to open', () => {
      const collapseAction = vi.fn()
      const { container } = render(<CollapsableDiv label='Section' collapseAction={collapseAction}><p>content</p></CollapsableDiv>)
      const toggle = container.querySelector('.cursor-pointer')

      fireEvent.click(toggle) // closed -> open
      expect(collapseAction).toHaveBeenCalledOnce()

      fireEvent.click(toggle) // open -> closed
      expect(collapseAction).toHaveBeenCalledOnce()
   })
})
