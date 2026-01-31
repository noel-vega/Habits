import "../index.css"
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { useAuth } from "@/features/auth/store"
import { me } from "@/features/auth/api"

const RootLayout = () => (
  <div className="h-dvh">
    <Outlet />
  </div>
)

export const Route = createRootRouteWithContext<{ queryClient: QueryClient, today: Date }>()({
  beforeLoad: async ({ location }) => {
    const response = await me()
    if (response.success) {
      useAuth.setState(response.data)
      if (location.pathname.startsWith("/auth")) {
        throw redirect({ to: "/app/habits" })
      }
    } else if (!location.pathname.startsWith("/auth")) {
      throw redirect({ to: "/auth/signin" })
    }
  },
  component: RootLayout
})
