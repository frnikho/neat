import {createFileRoute, Outlet} from '@tanstack/react-router'
import appCss from "@styles/dashboard.css?url"
import '@styles/dashboard.css';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
    head: () => ({
        meta: [
            {
                title: 'Dashboard',
            }
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
        ],
    }),
})

function RouteComponent() {
  return <><Outlet/></>
}