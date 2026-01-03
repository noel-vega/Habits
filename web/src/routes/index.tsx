import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const today = new Date();
    return { today }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    Home
  </div>
}

