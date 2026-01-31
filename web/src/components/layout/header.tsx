import { useHeaderStore } from "@/hooks/use-header"
import { useTranslation } from "react-i18next"
import { SidebarTrigger } from "../ui/sidebar"
import { LogOutIcon } from "lucide-react"
import { Button } from "../ui/button"

export function Header() {
  const { title } = useHeaderStore()
  const { t } = useTranslation()

  return (
    <div className="h-16 border-b flex items-center px-4 gap-4">
      <SidebarTrigger>Menu</SidebarTrigger>
      <p className="font-bold text-2xl">{t(title)}</p>
      <div className="ml-auto">
        <Button className="" size="icon-sm" variant="ghost">
          <LogOutIcon size={10} />
        </Button>
      </div>
    </div>)
}
