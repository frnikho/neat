import { createFileRoute } from '@tanstack/react-router'
import ToolsHead from "@app/components/tools-head";

export const Route = createFileRoute('/dashboard/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <>
        <ToolsHead items={[{title: 'Settings', url: '/dashboard/settings'}]}/>
      </>
  )
}
