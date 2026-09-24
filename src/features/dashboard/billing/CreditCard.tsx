import { Nfc } from 'lucide-react'
import { Tilt } from '@/components/fx'
import { cn } from '@/lib/utils'

const noise =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function CreditCardVisual({ last4, name, expiry, className }: { last4: string; name: string; expiry: string; className?: string }) {
  return (
    <Tilt max={10} className={cn('w-full', className)}>
      <div
        className="group/card relative aspect-[1.586] w-full overflow-hidden rounded-2xl text-white shadow-[0_24px_48px_-16px_rgba(40,20,90,.55),0_0_0_1px_rgba(255,255,255,.08)_inset]"
        style={{
          background:
            'radial-gradient(120% 140% at 0% 0%, oklch(0.55 0.25 292) 0%, transparent 55%), radial-gradient(90% 120% at 100% 100%, oklch(0.62 0.16 215) 0%, transparent 60%), linear-gradient(135deg, oklch(0.28 0.08 285), oklch(0.18 0.05 260))',
        }}
      >
        <div className="absolute inset-0 opacity-[0.22] mix-blend-overlay" style={{ backgroundImage: noise }} />
        {/* Sheen follows the tilt */}
        <div className="absolute -inset-1/2 rotate-12 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,.18)_50%,transparent_60%)] transition-transform duration-700 ease-out group-hover/card:translate-x-1/4" />
        <svg className="absolute -right-10 -bottom-16 size-56 opacity-20" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth=".6" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="white" strokeWidth=".6" />
          <circle cx="50" cy="50" r="24" fill="none" stroke="white" strokeWidth=".6" />
        </svg>

        <div className="relative flex h-full flex-col justify-between p-5" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-medium tracking-[0.2em] text-white/70 uppercase">Dashward Corporate</span>
            <Nfc className="size-5 text-white/70" />
          </div>
          <div>
            <svg viewBox="0 0 40 30" className="mb-3 h-7 w-9" aria-hidden>
              <defs>
                <linearGradient id="chip-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f5e3a3" />
                  <stop offset=".5" stopColor="#c9a34f" />
                  <stop offset="1" stopColor="#f0d98a" />
                </linearGradient>
              </defs>
              <rect x=".5" y=".5" width="39" height="29" rx="5" fill="url(#chip-g)" stroke="rgba(0,0,0,.2)" />
              <path d="M0 10h13M0 20h13M27 10h13M27 20h13M13 0v30M27 0v30M13 15h14" stroke="rgba(0,0,0,.28)" strokeWidth=".8" fill="none" />
            </svg>
            <div className="font-mono text-[17px] tracking-[0.18em] text-white/95 sm:text-lg" aria-label={`Card ending in ${last4}`}>
              •••• •••• •••• {last4}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex gap-6">
              <div>
                <div className="text-[9px] tracking-widest text-white/55 uppercase">Card holder</div>
                <div className="text-[13px] font-medium tracking-wide uppercase">{name}</div>
              </div>
              <div>
                <div className="text-[9px] tracking-widest text-white/55 uppercase">Expires</div>
                <div className="font-mono text-[13px]">{expiry}</div>
              </div>
            </div>
            <span className="text-xl font-black tracking-tight text-white italic">VISA</span>
          </div>
        </div>
      </div>
    </Tilt>
  )
}
