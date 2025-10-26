import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from '../src/App.jsx'
import * as monitoring from '../src/monitoring.js'

vi.mock('../src/monitoring.js')

describe('App', () => {
  it('increments counter and records metrics', () => {
    const recordInteraction = vi.fn()
    vi.spyOn(monitoring, 'recordInteraction').mockImplementation(recordInteraction)

    render(<App />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(button.textContent).toContain('1')
    expect(recordInteraction).toHaveBeenCalledWith('counter.increment', { value: 1 })
  })
})
