import { useStreamText } from '@/hooks/useStreamText'
import { cn } from '@/lib/utils'

export function Typewriter({ text, speed = 18, start = true, className, onDoneClassName }: { text: string; speed?: number; start?: boolean; className?: string; onDoneClassName?: string }) {
  const { text: shown, done } = useStreamText(text, { speed, start })
  return (
    <span className={cn(className, done && onDoneClassName)}>
      {shown}
      {!done && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-blink bg-accent" />}
    </span>
  )
}
