import { useSyncExternalStore } from 'react'

const KEY = 'dw-intro-seen'

function shouldPlay() {
  if (typeof window === 'undefined') return false
  if (window.location.pathname !== '/') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(KEY) !== '1'
  } catch {
    return false
  }
}

let playing = shouldPlay()
const subs = new Set<() => void>()

/** Whether the landing preloader is (or will be) covering the screen. */
export const introPlaying = () => playing

export function finishIntro() {
  if (!playing) return
  playing = false
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    /* storage unavailable */
  }
  subs.forEach((f) => f())
}

// Safety net: never leave the page waiting on an intro that was interrupted.
if (playing) setTimeout(finishIntro, 4000)

const subscribe = (cb: () => void) => {
  subs.add(cb)
  return () => subs.delete(cb)
}

/** True once the preloader has finished (or immediately if it never plays). */
export function useIntroDone() {
  return !useSyncExternalStore(subscribe, () => playing, () => false)
}
