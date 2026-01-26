import "../index.css"
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

const RootLayout = () => (
  <Outlet />
)

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async () => {
    return { today: new Date() }
  },
  component: RootLayout
})
