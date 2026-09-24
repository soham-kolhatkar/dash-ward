import { LogoMark } from '@/components/ui/logo'

export function RouteFallback({ fullscreen = true }: { fullscreen?: boolean }) {
  return (
    <div className={fullscreen ? 'grid min-h-dvh place-items-center' : 'grid min-h-[60vh] place-items-center'}>
      <div className="relative">
        <div className="absolute inset-0 animate-pulse-ring rounded-xl bg-accent/30" />
        <LogoMark className="relative size-9 animate-pulse" />
      </div>
    </div>
  )
}
