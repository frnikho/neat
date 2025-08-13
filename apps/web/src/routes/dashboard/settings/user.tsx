import ToolsHead from "@app/components/tools-head";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings/user")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<ToolsHead
				items={[
					{ title: "Settings", url: "/dashboard/settings" },
					{ title: "Users", url: "" },
				]}
			/>
		</>
	);
}
