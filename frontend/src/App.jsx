import { useCallback, useState } from 'react'
import { recordInteraction } from './monitoring.js'

export default function App () {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    const next = count + 1
    setCount(next)
    recordInteraction('counter.increment', { value: next })
  }, [count])

  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>MyclosetB</h1>
      <p>Observability ready starter frontend.</p>
      <button type="button" onClick={handleClick}>
        Clicked {count} times
      </button>
    </main>
  )
}
