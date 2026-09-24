import { createBrowserRouter } from 'react-router'
import { RequireApp, RequireUser } from '@/components/layout/Guards'
import { RouteFallback } from '@/components/layout/RouteFallback'
import { RouteError } from '@/pages/RouteError'

type Mod = { default: React.ComponentType }
const lazy = (load: () => Promise<Mod>) => async () => ({ Component: (await load()).default })

export const router = createBrowserRouter(
  [
    {
      errorElement: <RouteError />,
      hydrateFallbackElement: <RouteFallback />,
      children: [
        {
          lazy: lazy(() => import('@/features/marketing/MarketingLayout')),
          children: [
            { index: true, lazy: lazy(() => import('@/features/landing/LandingPage')) },
            { path: 'pricing', lazy: lazy(() => import('@/features/pricing/PricingPage')) },
          ],
        },
        {
          lazy: lazy(() => import('@/features/auth/AuthLayout')),
          children: [
            { path: 'login', lazy: lazy(() => import('@/features/auth/LoginPage')) },
            { path: 'signup', lazy: lazy(() => import('@/features/auth/SignupPage')) },
            {
              path: 'forgot-password',
              lazy: lazy(() => import('@/features/auth/ForgotPasswordPage')),
            },
          ],
        },
        {
          element: <RequireUser />,
          children: [
            {
              path: 'onboarding',
              lazy: lazy(() => import('@/features/onboarding/OnboardingPage')),
            },
          ],
        },
        {
          path: 'app',
          element: <RequireApp />,
          children: [
            {
              lazy: lazy(() => import('@/features/app/AppLayout')),
              children: [
                {
                  index: true,
                  lazy: lazy(() => import('@/features/dashboard/overview/OverviewPage')),
                },
                {
                  path: 'analytics',
                  lazy: lazy(() => import('@/features/dashboard/analytics/AnalyticsPage')),
                },
                {
                  path: 'customers',
                  lazy: lazy(() => import('@/features/dashboard/customers/CustomersPage')),
                },
                { path: 'ai', lazy: lazy(() => import('@/features/dashboard/ai/AssistantPage')) },
                { path: 'inbox', lazy: lazy(() => import('@/features/dashboard/inbox/InboxPage')) },
                {
                  path: 'billing',
                  lazy: lazy(() => import('@/features/dashboard/billing/BillingPage')),
                },
                {
                  path: 'settings',
                  lazy: lazy(() => import('@/features/dashboard/settings/SettingsPage')),
                },
              ],
            },
          ],
        },
        { path: '*', lazy: lazy(() => import('@/pages/NotFound')) },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)
