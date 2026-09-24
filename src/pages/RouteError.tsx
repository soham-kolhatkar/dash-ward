import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { buttonVariants } from '@/components/ui/button'

export function RouteError() {
  const err = useRouteError()
  const msg = isRouteErrorResponse(err) ? `${err.status} ${err.statusText}` : err instanceof Error ? err.message : 'Unknown error'
  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs text-danger">Something broke</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">We hit an unexpected error</h1>
        <p className="mt-2 max-w-md text-sm text-fg-muted">{msg}</p>
        <Link to="/" className={buttonVariants({ className: 'mt-6' })}>
          Back to home
        </Link>
      </div>
    </div>
  )
}
