import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn, initials } from '@/lib/utils'

const hues = [290, 210, 130, 20, 60, 330, 170]

export function Avatar({ name, src, className }: { name: string; src?: string; className?: string }) {
  const hue = hues[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length]
  return (
    <AvatarPrimitive.Root
      className={cn('@container relative inline-flex size-8 shrink-0 overflow-hidden rounded-full ring-2 ring-bg', className)}
    >
      {src && <AvatarPrimitive.Image src={src} alt={name} className="size-full object-cover" />}
      <AvatarPrimitive.Fallback
        className="flex size-full items-center justify-center text-[0.7em] font-semibold text-white"
        style={{
          background: `linear-gradient(135deg, oklch(0.65 0.2 ${hue}), oklch(0.55 0.22 ${hue + 40}))`,
          fontSize: 'inherit',
        }}
      >
        <span className="text-[38cqw] leading-none">{initials(name)}</span>
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}

export function AvatarStack({ names, max = 4, className }: { names: string[]; max?: number; className?: string }) {
  return (
    <div className={cn('flex -space-x-2', className)}>
      {names.slice(0, max).map((n) => (
        <Avatar key={n} name={n} className="size-7" />
      ))}
      {names.length > max && (
        <span className="flex size-7 items-center justify-center rounded-full bg-surface-3 text-[10px] font-medium ring-2 ring-bg">
          +{names.length - max}
        </span>
      )}
    </div>
  )
}
