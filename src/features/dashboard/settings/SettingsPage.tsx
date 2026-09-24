import { Bell, Building, KeyRound, Palette, User, Users } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '../PageHeader'
import { ApiKeysTab } from './ApiKeysTab'
import { AppearanceTab } from './AppearanceTab'
import { NotificationsTab } from './NotificationsTab'
import { ProfileTab } from './ProfileTab'
import { TeamTab } from './TeamTab'
import { WorkspaceTab } from './WorkspaceTab'

const TABS = [
  { value: 'profile', label: 'Profile', icon: User, Component: ProfileTab },
  { value: 'workspace', label: 'Workspace', icon: Building, Component: WorkspaceTab },
  { value: 'notifications', label: 'Notifications', icon: Bell, Component: NotificationsTab },
  { value: 'appearance', label: 'Appearance', icon: Palette, Component: AppearanceTab },
  { value: 'api', label: 'API keys', icon: KeyRound, Component: ApiKeysTab },
  { value: 'team', label: 'Team', icon: Users, Component: TeamTab },
] as const

type TabValue = (typeof TABS)[number]['value']

export default function SettingsPage() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const tab: TabValue = TABS.some((t) => t.value === raw) ? (raw as TabValue) : 'profile'

  return (
    <div className="pb-24">
      <PageHeader title="Settings" description="Manage your profile, workspace, notifications and access." />
      <Tabs
        value={tab}
        onValueChange={(v) =>
          setParams(
            (p) => {
              const n = new URLSearchParams(p)
              n.set('tab', v)
              return n
            },
            { replace: true },
          )
        }
      >
        <div className="scrollbar-none -mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList className="w-max">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="whitespace-nowrap">
                <t.icon /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {TABS.map((t) => (
          <TabsContent key={t.value} value={t.value} className="outline-none">
            <t.Component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
