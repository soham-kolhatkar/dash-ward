import { useEffect, useState } from 'react'

/**
 * Reveals `text` token-by-token like an LLM stream.
 * Returns the visible text and whether streaming is finished.
 */
export function useStreamText(text: string, { speed = 18, start = true } = {}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(0)
  }, [text])

  useEffect(() => {
    if (!start || count >= text.length) return
    const chunk = 1 + Math.floor(Math.random() * 3)
    const id = setTimeout(() => setCount((c) => Math.min(text.length, c + chunk)), speed + Math.random() * speed)
    return () => clearTimeout(id)
  }, [count, text, speed, start])

  return { text: text.slice(0, count), done: count >= text.length }
}
