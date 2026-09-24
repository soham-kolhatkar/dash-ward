const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const currencyCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})
const number = new Intl.NumberFormat('en-US')

export const fmt = {
  compact: (n: number) => compact.format(n),
  currency: (n: number) => currency.format(n),
  currencyCompact: (n: number) => currencyCompact.format(n),
  number: (n: number) => number.format(Math.round(n)),
  percent: (n: number, digits = 1) => `${n >= 0 ? '' : '−'}${Math.abs(n).toFixed(digits)}%`,
  delta: (n: number, digits = 1) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(digits)}%`,
  date: (d: Date | string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  shortDate: (d: Date | string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  time: (d: Date | string) =>
    new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  relative: (d: Date | string) => {
    const diff = (Date.now() - new Date(d).getTime()) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return fmt.shortDate(d)
  },
}
