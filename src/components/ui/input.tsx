import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type LabelHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const field =
  'w-full rounded-xl border border-border bg-surface-2/60 px-3.5 text-sm text-fg placeholder:text-fg-subtle transition-all duration-200 outline-none hover:border-border-strong focus:border-accent/60 focus:bg-surface focus:ring-4 focus:ring-ring/20 disabled:opacity-50 aria-[invalid=true]:border-danger/60 aria-[invalid=true]:ring-danger/15'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  trailing?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, icon, trailing, ...props }, ref) => {
  if (!icon && !trailing) return <input ref={ref} className={cn(field, 'h-11', className)} {...props} />
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-fg-subtle [&_svg]:size-4">
          {icon}
        </span>
      )}
      <input ref={ref} className={cn(field, 'h-11', icon && 'pl-10', trailing && 'pr-10', className)} {...props} />
      {trailing && <span className="absolute top-1/2 right-2 -translate-y-1/2">{trailing}</span>}
    </div>
  )
})
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(field, 'min-h-24 resize-none py-3', className)} {...props} />
  ),
)
Textarea.displayName = 'Textarea'

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-fg', className)} {...props} />
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null
  return <p className="mt-1.5 text-xs text-danger">{children}</p>
}
