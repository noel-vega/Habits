import { useEffect, useState } from "react";

export function useDialog(isOpen: boolean = false) {
  const [open, onOpenChange] = useState(isOpen)

  const close = () => onOpenChange(false)
  return {
    open, onOpenChange, close, handleOpenDialog: () => onOpenChange(true)
  }
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
