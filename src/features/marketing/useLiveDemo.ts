import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/store/auth'

/** Signs in as the demo user and jumps straight into the dashboard. */
export function useLiveDemo() {
  const navigate = useNavigate()
  return useCallback(() => {
    useAuth.getState().demoLogin()
    navigate('/app')
  }, [navigate])
}
