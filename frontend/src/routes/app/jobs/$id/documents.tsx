import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/jobs/$id/documents')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/jobs/$id/documents"!</div>
}
