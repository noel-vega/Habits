import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import "../index.css"
import { queryClient } from '@/lib/react-query'
import { getListHabitsQueryOptions } from '@/api'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'

const RootLayout = () => (
  <>
    <SidebarProvider>
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({
  beforeLoad: async () => {
    const initialHabits = await queryClient.ensureQueryData(getListHabitsQueryOptions())
    return { initialHabits, today: new Date() }
  },


  component: RootLayout
})
