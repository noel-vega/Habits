import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useHeaderStore } from '@/hooks/use-header'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

export const Route = createFileRoute('/app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full flex flex-col">
        <Header />
        <Main>
          <Outlet />
        </Main>
      </div>
    </SidebarProvider>
  )
}


function Main(props: PropsWithChildren) {
  return (
    <div className="flex-1 flex">
      {props.children}
    </div>
  )
}

function Header() {
  const { title } = useHeaderStore()
  return (
    <div className="h-14 border-b flex items-center px-4 gap-4">
      <SidebarTrigger>Menu</SidebarTrigger>
      <p className="font-bold text-xl">{title}</p>
    </div>)
}
