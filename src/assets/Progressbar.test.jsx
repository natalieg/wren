import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import { MultiProgressbar } from './Progressbar'

afterEach(cleanup)

describe('MultiProgressbar', () => {
   it('splits bar width by each entry\'s share of the total', () => {
      const { container } = render(<MultiProgressbar objectArray={[
         { label: 'A', color: 'bg-emerald-500', value: 30 },
         { label: 'B', color: 'bg-pink-600', value: 70 },
      ]} />)

      expect(container.querySelector('.bg-emerald-500').style.width).toBe('30%')
      expect(container.querySelector('.bg-pink-600').style.width).toBe('70%')
   })

   it('renders zero-width bars instead of dividing by zero when everything is empty', () => {
      const { container } = render(<MultiProgressbar objectArray={[
         { label: 'A', color: 'bg-emerald-500', value: 0 },
      ]} />)

      expect(container.querySelector('.bg-emerald-500').style.width).toBe('0%')
   })

   it('marks only the highest entry when markHighest is set', () => {
      render(<MultiProgressbar markHighest objectArray={[
         { label: 'Small', color: 'bg-emerald-500', value: 10 },
         { label: 'Big', color: 'bg-pink-600', value: 90 },
      ]} />)

      expect(screen.getByText('Big').closest('div').className).toContain('bg-accent-muted/50')
      expect(screen.getByText('Small').closest('div').className).not.toContain('bg-accent-muted/50')
   })

   it('does not mark anything when markHighest is left off', () => {
      render(<MultiProgressbar objectArray={[
         { label: 'Small', color: 'bg-emerald-500', value: 10 },
         { label: 'Big', color: 'bg-pink-600', value: 90 },
      ]} />)

      expect(screen.getByText('Big').closest('div').className).not.toContain('bg-accent-muted/50')
   })
})
