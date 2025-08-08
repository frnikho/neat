/// <reference types="vite/client" />
import {createFileRoute, Outlet, Scripts} from '@tanstack/react-router'
import appCss from "@styles/dashboard.css?url"
import '@styles/dashboard.css';
import {SidebarInset, SidebarProvider} from "@app/components/ui/sidebar";
import {AppSidebar} from "@app/components/app-sidebar";

export const Route = createFileRoute('/dashboard')({
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
    component: RouteComponent,
})

function RouteComponent() {
    return (<>
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className={'p-4'}>
                <Outlet/>
            </SidebarInset>
        </SidebarProvider>
        <Scripts/>
    </>)
}
