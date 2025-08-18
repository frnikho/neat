import {createFileRoute} from '@tanstack/react-router'
import ToolsHead from "@app/components/tools-head";

export const Route = createFileRoute('/dashboard/about')({
    component: RouteComponent,
    head: () => ({
        meta: [
            {
                title: "Support",
            },
        ],
    })
})

function RouteComponent() {
    return (
        <div>
            <ToolsHead items={[{title: "Support"}]}/>
        </div>
    )
}
