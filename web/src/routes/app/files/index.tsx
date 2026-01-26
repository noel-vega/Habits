import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/files/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/files/"!</div>
}
