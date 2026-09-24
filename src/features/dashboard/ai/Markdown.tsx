import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Block = { type: 'p'; text: string } | { type: 'ul' | 'ol'; items: string[] }

function parse(src: string): Block[] {
  const blocks: Block[] = []
  for (const raw of src.split('\n')) {
    const line = raw.trimEnd()
    const bullet = /^\s*[-•*]\s+(.*)$/.exec(line)
    const num = /^\s*\d+[.)]\s+(.*)$/.exec(line)
    const last = blocks[blocks.length - 1]
    if (bullet || num) {
      const type = bullet ? 'ul' : 'ol'
      const text = (bullet ?? num)![1]
      if (last && last.type === type) last.items.push(text)
      else blocks.push({ type, items: [text] })
    } else if (!line.trim()) {
      blocks.push({ type: 'p', text: '' })
    } else if (last?.type === 'p' && last.text) {
      last.text += ' ' + line
    } else {
      blocks.push({ type: 'p', text: line })
    }
  }
  return blocks.filter((b) => b.type !== 'p' || b.text)
}

/** Inline **bold** and `code`. Dangling markers from a partial stream are hidden. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return (
        <strong key={i} className="font-semibold text-fg">
          {part.slice(2, -2)}
        </strong>
      )
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return (
        <code key={i} className="rounded-md border border-border bg-surface-2 px-1.5 py-px font-mono text-[0.85em] text-fg">
          {part.slice(1, -1)}
        </code>
      )
    return part.replace(/\*\*|`/g, '')
  })
}

const Caret = () => (
  <span aria-hidden className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[3px] animate-blink rounded-[2px] bg-accent" />
)

export function Markdown({ text, caret, className }: { text: string; caret?: boolean; className?: string }) {
  const blocks = parse(text)
  const lastIdx = blocks.length - 1
  return (
    <div className={cn('space-y-3 text-[14.5px] leading-relaxed text-fg-muted', className)}>
      {blocks.map((b, i) => {
        const tail = caret && i === lastIdx ? <Caret /> : null
        if (b.type === 'p')
          return (
            <p key={i}>
              {inline(b.text)}
              {tail}
            </p>
          )
        const List = b.type
        return (
          <List key={i} className={cn('space-y-2 pl-1', b.type === 'ol' && 'list-decimal pl-5')}>
            {b.items.map((it, j) => (
              <li key={j} className={cn(b.type === 'ul' && 'relative pl-5')}>
                {b.type === 'ul' && <span aria-hidden className="absolute top-[0.62em] left-1 size-1.5 rounded-full bg-accent/70" />}
                {inline(it)}
                {caret && i === lastIdx && j === b.items.length - 1 && <Caret />}
              </li>
            ))}
          </List>
        )
      })}
      {caret && blocks.length === 0 && <Caret />}
    </div>
  )
}
