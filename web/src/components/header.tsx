import type { PropsWithChildren } from "react";

export function Header({ children }: PropsWithChildren) {
  return (
    <header className="flex items-center gap-4">
      {children}
    </header>
  )
}
