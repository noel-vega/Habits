import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Todo } from "../types"


type Props = {
  todo?: Todo | null
  onClose: () => void
}

export function TodoInfoDialog(props: Props) {
  const isOpen = props.todo ? true : false
  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => {
      if (isOpen === false) props.onClose()
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.todo?.name}</DialogTitle>
        </DialogHeader>

      </DialogContent>
    </Dialog>
  )
}
