import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { BanknoteIcon, ListIcon, MailIcon, SproutIcon, User2Icon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const items = [
  {
    title: "Habits",
    url: "/habits",
    icon: SproutIcon,
  },
  {
    title: "Todos",
    url: "/habits",
    icon: ListIcon,
  },
  {
    title: "Finances",
    url: "#",
    icon: BanknoteIcon,
  },
  {
    title: "Email",
    url: "#",
    icon: MailIcon,
  },
]
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={"/"}>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>NV</AvatarFallback>
                  </Avatar>
                  <span>Noel Vega</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarFooter />
    </Sidebar>
  )
}
