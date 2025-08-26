import React, { useEffect, useState } from 'react'
import { createReview, getReview } from './lib/api'

export default function App() {
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('idle')
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  async function start() {
    setError(null)
    setItems([])
    setStatus('creating')
    try {
      const { reviewId } = await createReview()
      setReviewId(reviewId)
      setStatus('queued')
    } catch (e: any) {
      setError(e.message)
      setStatus('idle')
    }
  }

  useEffect(() => {
    if (!reviewId) return
    let timer: number
    const tick = async () => {
      try {
        const s = await getReview(reviewId)
        setStatus(s.status)
        if (s.status === 'complete' && s.items) setItems(s.items)
        if (s.status !== 'complete' && s.status !== 'failed') {
          timer = window.setTimeout(tick, 600) // simple poll
        }
      } catch (e: any) {
        setError(e.message)
      }
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [reviewId])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>🐾 Error Ferret — React App</h1>
      <p>Kick off a review and watch the worker do its thing.</p>

      <button onClick={start} disabled={status !== 'idle' && status !== 'complete'}>
        Start Review
      </button>

      <section style={{ marginTop: 16 }}>
        <div><strong>Status:</strong> {status}</div>
        {reviewId && <div><strong>Review ID:</strong> {reviewId}</div>}
        {error && <div style={{ color: 'crimson' }}><strong>Error:</strong> {error}</div>}
      </section>

      {items.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2>Feedback</h2>
          <ul>
            {items.map((it, i) => (
              <li key={i}>
                L{it.line}:{it.column} — {it.issue} → <em>{it.suggestion}</em> [{it.severity}]
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}