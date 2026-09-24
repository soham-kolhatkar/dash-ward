/** Deterministic PRNG so mock data is stable across reloads. */
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createRng(seed = 42) {
  const r = mulberry32(seed)
  return {
    next: r,
    range: (min: number, max: number) => min + r() * (max - min),
    int: (min: number, max: number) => Math.floor(min + r() * (max - min + 1)),
    pick: <T,>(arr: readonly T[]) => arr[Math.floor(r() * arr.length)],
    bool: (p = 0.5) => r() < p,
  }
}
