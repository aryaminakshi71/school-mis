import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/fees/structure')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/fees/structure"!</div>
}
