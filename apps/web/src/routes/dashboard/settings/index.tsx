import ToolsHead from "@app/components/tools-head";
import { Button } from "@app/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings/")({
	component: RouteComponent,
});

function RouteComponent() {

	return (
		<>
            <ToolsHead items={[{ title: "Settings", url: "/dashboard/settings" }]} />
			<Button onClick={() => console.log("abc")}>Hello World</Button>
		</>
	);
}
