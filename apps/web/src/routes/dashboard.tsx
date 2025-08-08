/// <reference types="vite/client" />
import {createFileRoute, HeadContent, Outlet} from '@tanstack/react-router'
import appCss from "@styles/dashboard.css?url"
import '@styles/dashboard.css';
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@app/components/ui/sidebar";
import {AppSidebar} from "@app/components/app-sidebar";
import {Separator} from "@app/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@app/components/ui/breadcrumb";
import {Scripts} from "@tanstack/react-start";

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
        <HeadContent/>
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Outlet/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    </>)
}
