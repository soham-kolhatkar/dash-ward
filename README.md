# Dashward

A frontend-only SaaS experience for a fictional **AI analytics platform**. It runs from landing page to sign-up, onboarding and a full dashboard, with a hand-built design system, dark and light themes, and a lot of motion.

There is no backend. All data is mocked and deterministic, "live" numbers are simulated with timers, and state (auth, onboarding answers, theme, sidebar) is persisted in `localStorage`.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serve the production build
npm run lint
```

To skip straight to the product, click **Live demo** on the landing page, or **Use demo account** on the sign-in page.

## Tour

| Route | What's there |
| --- | --- |
| `/` | Preloader, 3D shader-orb hero (R3F), logo marquee, a 3D product reveal driven by scroll, a bento grid of live widgets (streaming AI answer, live chart, WebGL globe, orbiting integrations), pinned horizontal "How it works", stats, testimonial marquees, pricing teaser, CTA and footer |
| `/pricing` | Monthly/yearly toggle with animated prices, tier cards, comparison table, FAQ |
| `/login` `/signup` `/forgot-password` | Split-screen auth with validated forms, password strength meter, loading→success states |
| `/onboarding` | 6-step wizard (workspace, role, goals, data sources with animated hub lines, invites, theme), then a "building your dashboard" sequence with confetti |
| `/app` | Overview: KPIs, live revenue chart, streaming AI insights, realtime globe, funnel, channels, activity feed |
| `/app/analytics` | Traffic, retention cohorts and engagement heatmaps |
| `/app/customers` | Searchable, sortable, selectable table with a detail drawer and bulk actions |
| `/app/ai` | AI analyst chat with streamed responses and inline charts |
| `/app/inbox` | Two-pane inbox with archive/undo |
| `/app/billing` | Plan, card, usage meters, invoices |
| `/app/settings` | Profile, workspace, notifications, appearance, API keys, team |
| anything else | Animated 404 |

Press **⌘K / Ctrl+K** anywhere in the app to open the command palette.

## Stack

- **React 19 + TypeScript + Vite**, **Tailwind CSS v4** (CSS-first tokens in `src/styles/globals.css`)
- **Motion** (Framer Motion) for UI transitions, **GSAP** (ScrollTrigger, SplitText) for scroll choreography, **Lenis** for smooth scrolling
- **three.js / React Three Fiber** for the hero, **cobe** for the globe
- **Radix UI** primitives, **cmdk**, **Recharts**, **Zustand**, **react-hook-form + zod**, **sonner**, **lucide-react**

## Project layout

```
src/
  styles/globals.css     design tokens (light on :root, dark on .dark), utilities, keyframes
  components/
    ui/                  primitives (button, card, dialog, tabs, select…)
    fx/                  effects (Aurora, SpotlightCard, Magnetic, TextReveal, NumberTicker, Marquee, BorderBeam…)
    three/               hero scene + globe (lazy-loaded)
    charts/              chart building blocks
    layout/              theme toggle, route guards, fallbacks
  features/
    marketing/ landing/ pricing/ auth/ onboarding/ app/ dashboard/*
  data/                  deterministic mock data
  store/                 zustand stores (theme, auth, onboarding, ui)
  hooks/ lib/
```

## Theming

Every color is a CSS variable, and Tailwind utilities (`bg-surface`, `text-fg-muted`, `border-border`, `text-accent`…) resolve through `@theme inline`, so components never hard-code a theme. The toggle uses the View Transitions API to reveal the new theme as a circle expanding from the button. It follows the system preference until you pick a theme yourself.

## Motion and accessibility

Reduced motion is respected everywhere. When the OS requests it, Lenis, the WebGL hero, scroll pinning, the preloader and confetti are all turned off, and Motion falls back to instant transitions. Interactive primitives come from Radix, so focus management and keyboard navigation work.
