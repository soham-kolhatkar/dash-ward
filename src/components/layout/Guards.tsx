import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/store/auth'

/** Signed-in users only; sends un-onboarded users to onboarding. */
export function RequireApp() {
  const { user, onboarded } = useAuth()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  if (!onboarded) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

export function RequireUser() {
  const user = useAuth((s) => s.user)
  if (!user) return <Navigate to="/signup" replace />
  return <Outlet />
}
