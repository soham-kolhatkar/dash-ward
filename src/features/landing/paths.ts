/** Builds a smooth (Catmull-Rom → cubic Bézier) SVG path through `values`, scaled into w × h. */
export function smoothPath(values: number[], w: number, h: number, pad = 4, min?: number, max?: number) {
  const lo = min ?? Math.min(...values)
  const hi = max ?? Math.max(...values)
  const span = hi - lo || 1
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, pad + (1 - (v - lo) / span) * (h - pad * 2)] as const)
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return { line: d, area: `${d} L${w},${h} L0,${h} Z`, points: pts }
}

/** Deterministic pseudo-random walk, handy for mock charts. */
export function walk(n: number, seed = 1, start = 50, drift = 0.6, vol = 6) {
  let s = seed
  const rnd = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  let v = start
  return Array.from({ length: n }, () => {
    v += drift + (rnd() - 0.5) * vol
    return v
  })
}
