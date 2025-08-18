/// <reference types="vite/client" />
import appCss from '@styles/dashboard.css?url';

import { createFileRoute, Outlet, Scripts } from "@tanstack/react-router";
import { AppSidebar } from "@app/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@app/components/ui/sidebar";
import { Toaster } from "@app/components/ui/sonner";
import { UserContextProvider } from "@app/context/user.context";
import {authFromServer, getAuth} from "@app/server/user.server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {ThemeProvider} from "@app/components/providers/theme.provider";

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
	loader: () => getAuth(),
});

const queryClient = new QueryClient();

function RouteComponent() {
	const ctxData = Route.useLoaderData();

    console.log('userContext', ctxData);

	return (
		<QueryClientProvider client={queryClient}>
			<UserContextProvider ctx={ctxData}>
				<ThemeProvider storageKey={'dashboard-theme'} defaultTheme={'system'}>
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset className={"p-4"}>
                            <Outlet />
                        </SidebarInset>
                    </SidebarProvider>
                    <Toaster richColors theme={"dark"} />
                    <Scripts />
                </ThemeProvider>
			</UserContextProvider>
		</QueryClientProvider>
	);
}
