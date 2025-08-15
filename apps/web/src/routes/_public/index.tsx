import { createFileRoute } from "@tanstack/react-router";
import HomePage from "../../customer/homepage";

export const Route = createFileRoute("/_public/")({
	component: RouteComponent,
});

function RouteComponent() {
	return HomePage();
}
