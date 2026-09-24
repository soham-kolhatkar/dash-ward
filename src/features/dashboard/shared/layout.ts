/**
 * Height for pages that fill the shell viewport (AI, Inbox): 100dvh minus topbar (56px + 1px border)
 * and main's vertical padding (2 × 24px). The shell can override via `--dw-shell-offset`.
 */
export const fillViewport = 'h-[calc(100dvh-var(--dw-shell-offset,105px))] min-h-[520px]'
