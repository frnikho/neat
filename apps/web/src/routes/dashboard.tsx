/// <reference types="vite/client" />
import appCss from '@styles/dashboard.css?url';

import { createFileRoute, Outlet, Scripts } from "@tanstack/react-router";
import { AppSidebar } from "@app/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@app/components/ui/sidebar";
import { Toaster } from "@app/components/ui/sonner";
import { UserContextProvider } from "@app/context/user.context";
import {authFromServer} from "@app/server/user.server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard")({
	head: () => ({
		meta: [
			{
				title: "Dashboard",
			},
		],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
	}),
	component: RouteComponent,
	loader: () => authFromServer(),
});

const queryClient = new QueryClient();

function RouteComponent() {
	const ctxData = Route.useLoaderData();

    console.log('ctxData', ctxData);

	return (
		<QueryClientProvider client={queryClient}>
			<UserContextProvider ctx={ctxData}>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset className={"p-4"}>
						<Outlet />
					</SidebarInset>
				</SidebarProvider>
				<Toaster richColors theme={"dark"} />
				<Scripts />
			</UserContextProvider>
		</QueryClientProvider>
	);
}
