import * as T from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'

export const TooltipProvider = T.Provider

export function Tooltip({
  content,
  children,
  side = 'top',
}: {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <T.Root>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content
          side={side}
          sideOffset={8}
          className="z-50 rounded-lg border border-border bg-fg px-2.5 py-1.5 text-xs font-medium text-bg shadow-elevated data-[state=delayed-open]:animate-[pop-in_.18s_var(--ease-out-expo)]"
        >
          {content}
        </T.Content>
      </T.Portal>
    </T.Root>
  )
}
