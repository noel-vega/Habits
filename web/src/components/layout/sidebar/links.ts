import { SproutIcon, ListIcon, BanknoteIcon, MailIcon, FilesIcon, LayoutDashboard, ShoppingBasketIcon } from "lucide-react";

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
    title: "Groceries",
    url: "/app/groceries",
    icon: ShoppingBasketIcon
  },
  {
    title: "Email",
    url: "/app/email",
    icon: MailIcon,
  },

  {
    title: "Documents",
    url: "/app/files",
    icon: FilesIcon,
  },
]
