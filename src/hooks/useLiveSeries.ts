import { useEffect, useState } from 'react'

export interface LivePoint {
  t: number
  v: number
}

/**
 * Simulates a streaming metric: keeps a rolling window of `size` points and
 * appends a new random-walk value every `interval` ms.
 */
export function useLiveSeries({
  size = 40,
  interval = 1500,
  base = 100,
  volatility = 0.08,
  paused = false,
}: { size?: number; interval?: number; base?: number; volatility?: number; paused?: boolean } = {}) {
  const [data, setData] = useState<LivePoint[]>(() => {
    const now = Date.now()
    let v = base
    return Array.from({ length: size }, (_, i) => {
      v = Math.max(base * 0.4, v + (Math.random() - 0.45) * base * volatility)
      return { t: now - (size - i) * interval, v }
    })
  })

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1]
        const v = Math.max(base * 0.4, last.v + (Math.random() - 0.45) * base * volatility)
        return [...prev.slice(1), { t: Date.now(), v }]
      })
    }, interval)
    return () => clearInterval(id)
  }, [interval, base, volatility, paused])

  return data
}

/** Integer counter that drifts up/down, for "live visitors" style readouts. */
export function useLiveCounter(start: number, spread = 12, interval = 2000) {
  const [n, setN] = useState(start)
  useEffect(() => {
    const id = setInterval(() => {
      setN((v) => Math.max(0, v + Math.round((Math.random() - 0.45) * spread)))
    }, interval)
    return () => clearInterval(id)
  }, [spread, interval])
  return n
}
