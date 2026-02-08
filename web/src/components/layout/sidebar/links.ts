import { SproutIcon, ListIcon, BanknoteIcon, MailIcon, FilesIcon, LayoutDashboard, ShoppingBasketIcon } from "lucide-react";

const isDev = import.meta.env.DEV

// TODO: make urls type safe with router
//
export const links = [
  {
    title: "Habits",
    url: "/app/habits",
    icon: SproutIcon,
    active: true,
  },
]

export const comingSoonLinks = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: LayoutDashboard,
    active: isDev,
  },
  {
    title: "Tasks",
    url: "/app/todos",
    icon: ListIcon,
    active: isDev,
  },
  {
    title: "Finances",
    url: "/app/finances",
    icon: BanknoteIcon,
    active: isDev,
  },
  {
    title: "Groceries",
    url: "/app/groceries",
    icon: ShoppingBasketIcon,
    active: isDev,
  },
  {
    title: "Email",
    url: "/app/email",
    icon: MailIcon,
    active: isDev,
  },
  {
    title: "Documents",
    url: "/app/documents",
    icon: FilesIcon,
    acitve: isDev,
  },
]
