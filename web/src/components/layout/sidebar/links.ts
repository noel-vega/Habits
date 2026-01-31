import { SproutIcon, ListIcon, BanknoteIcon, MailIcon, FilesIcon, LayoutDashboard } from "lucide-react";

// TODO: make urls type safe with router
export const links = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Habits",
    url: "/app/habits",
    icon: SproutIcon,
  },
  {
    title: "Tasks",
    url: "/app/todos",
    icon: ListIcon,
  },
  {
    title: "Finances",
    url: "/app/finances",
    icon: BanknoteIcon,
  },
  {
    title: "Email",
    url: "/app/email",
    icon: MailIcon,
  },

  {
    title: "Files",
    url: "/app/files",
    icon: FilesIcon,
  },
]
