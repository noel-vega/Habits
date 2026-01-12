import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import "../index.css"
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { queryClient } from '@/lib/react-query'
import { getListHabitsQueryOptions } from '@/api'

const RootLayout = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({
  beforeLoad: async () => {
    const initialHabits = await queryClient.ensureQueryData(getListHabitsQueryOptions())
    return { initialHabits }
  },


  component: RootLayout
})
