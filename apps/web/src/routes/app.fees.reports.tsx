import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/fees/reports')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/fees/reports"!</div>
}
