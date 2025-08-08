import { createFileRoute } from '@tanstack/react-router'
import {Button} from "@app/components/ui/button";

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><p>Hello "/dashboard/"!</p>
      <Button>Hello World</Button>
  </div>
}
