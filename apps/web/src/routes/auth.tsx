/// <reference types="vite/client" />
import appCss from '@styles/dashboard.css?url';
import { createFileRoute, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "@app/components/ui/sonner";

export const Route = createFileRoute("/auth")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{
				title: "Dashboard",
			},
		],
		links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
        ],
	}),
});

function RouteComponent() {
	return (
		<>
			<Outlet />
			<Scripts />
			<Toaster richColors />
		</>
	);
}
