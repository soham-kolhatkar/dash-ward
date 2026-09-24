import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { LogoMark } from '@/components/ui/logo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import { cn } from '@/lib/utils'
import { WORKSPACES, useShell, useWorkspace } from './shell'

export function WorkspaceMark({ id, hue, name, className }: { id: string; hue: number; name: string; className?: string }) {
  if (id === 'northwind') return <LogoMark className={cn('size-8', className)} />
  return (
    <span
      className={cn('flex size-8 items-center justify-center rounded-[9px] text-xs font-semibold text-white', className)}
      style={{ background: `linear-gradient(135deg, oklch(0.62 0.2 ${hue}), oklch(0.5 0.2 ${hue + 50}))` }}
    >
      {name[0]}
    </span>
  )
}

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const ws = useWorkspace()
  const setWorkspace = useShell((s) => s.setWorkspace)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'group flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left outline-none transition hover:bg-surface-2 data-[state=open]:bg-surface-2',
          collapsed && 'justify-center',
        )}
      >
        <WorkspaceMark {...ws} className="shrink-0 shadow-sm" />
        <motion.span
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.15 }}
          className={cn('min-w-0 flex-1', collapsed && 'pointer-events-none absolute')}
        >
          <span className="block truncate text-sm font-semibold tracking-tight">{ws.name}</span>
          <span className="block truncate text-[11px] text-fg-subtle">{ws.plan} plan · 4 members</span>
        </motion.span>
        {!collapsed && <ChevronsUpDown className="size-4 shrink-0 text-fg-subtle transition group-hover:text-fg-muted" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {WORKSPACES.map((w) => (
          <DropdownMenuItem
            key={w.id}
            onSelect={() => {
              setWorkspace(w.id)
              if (w.id !== ws.id) toast.success(`Switched to ${w.name}`)
            }}
          >
            <WorkspaceMark {...w} className="size-6 rounded-md text-[10px]" />
            <span className="flex-1">
              <span className="block text-fg">{w.name}</span>
              <span className="block text-[11px] text-fg-subtle">{w.plan}</span>
            </span>
            {w.id === ws.id && <Check className="text-accent" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => toast('Workspace creation is coming soon')}>
          <span className="flex size-6 items-center justify-center rounded-md border border-dashed border-border-strong">
            <Plus className="size-3.5!" />
          </span>
          Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
