import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/auth/logout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/auth/login"!</div>
}
