import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import TimeFlag, { TimeFlagTracking } from './TimeFlag'

// no `globals: true` in vite.config.js, so RTL can't register its own auto-cleanup
afterEach(cleanup)

describe('TimeFlag — finished tasks', () => {
   it('falls back to the estimate when nothing was tracked', () => {
      const { container } = render(<TimeFlag tracked={0} time={25} isFinished />)
      // regression guard: the check used to run on the *formatted string*, and
      // formatTimeWithSeconds(0) is "0" — truthy, so this fallback was unreachable
      expect(container.textContent.trim()).toBe('25m')
   })

   it('still falls back to the estimate below a full minute', () => {
      const { container } = render(<TimeFlag tracked={45} time={25} isFinished />)
      expect(container.textContent.trim()).toBe('25m')
   })

   it('shows tracked time in whole minutes once a full minute is reached', () => {
      // finished tasks drop the seconds — the running stopwatch keeps them
      const { container } = render(<TimeFlag tracked={305} time={25} isFinished />)
      expect(container.textContent.trim()).toBe('5m')
   })
})

describe('TimeFlag — open tasks', () => {
   it('shows only the estimate when untracked and not running', () => {
      const { container } = render(<TimeFlag tracked={0} time={25} />)
      expect(container.textContent.trim()).toBe('25')
   })

   it('shows tracked time and the estimate side by side while running', () => {
      const { container } = render(<TimeFlag tracked={125} time={25} isTracking />)
      expect(container.textContent).toContain('2:05')
      expect(container.textContent).toContain('25')
   })

   it('shows tracked time on a paused task that has tracked time', () => {
      const { container } = render(<TimeFlag tracked={125} time={25} />)
      expect(container.textContent).toContain('2:05')
   })
})

describe('TimeFlagTracking', () => {
   it('renders the tracked time', () => {
      const { container } = render(<TimeFlagTracking tracked={125} />)
      expect(container.textContent.trim()).toBe('2:05')
   })

   it('calls onClick when clicked', () => {
      const onClick = vi.fn()
      render(<TimeFlagTracking tracked={125} onClick={onClick} />)
      screen.getByText('2:05').click()
      expect(onClick).toHaveBeenCalledOnce()
   })
})
