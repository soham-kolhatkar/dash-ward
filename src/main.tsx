import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { Toaster } from 'sonner'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './styles/globals.css'
import { router } from './router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useTheme } from '@/store/theme'

function Toasts() {
  const theme = useTheme((s) => s.resolved)
  return (
    <Toaster
      theme={theme}
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: '!rounded-2xl !border-border !bg-surface/95 !backdrop-blur-xl !shadow-elevated !text-fg',
          description: '!text-fg-muted',
        },
      }}
    />
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={200}>
        <RouterProvider router={router} />
        <Toasts />
      </TooltipProvider>
    </MotionConfig>
  </StrictMode>,
)
