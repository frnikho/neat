import { createFileRoute } from '@tanstack/react-router'
import AccountSettings from "@app/components/settings/account";

export const Route = createFileRoute('/dashboard/account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
      <AccountSettings/>
  </>
}
