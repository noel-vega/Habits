import { useState } from "react";

export function useDialog() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)
  return {
    open, setOpen, close
  }
}
