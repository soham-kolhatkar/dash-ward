import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 ease-out-expo select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-fg text-bg hover:bg-fg/90 shadow-[0_1px_0_0_rgb(255_255_255/0.15)_inset,0_8px_24px_-8px_var(--glow)]',
        brand:
          'bg-gradient-button text-white shadow-glow hover:brightness-110 dark:text-accent-fg [background-size:180%_auto] hover:[background-position:100%_0]',
        secondary: 'bg-surface-2 text-fg border border-border hover:bg-surface-3 hover:border-border-strong',
        outline: 'border border-border-strong text-fg hover:bg-surface-2',
        ghost: 'text-fg-muted hover:text-fg hover:bg-surface-2',
        danger: 'bg-danger text-white hover:bg-danger/90',
        link: 'text-accent underline-offset-4 hover:underline rounded-none px-0',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-8 px-3.5 text-sm',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'size-9',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
