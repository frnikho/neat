import Login from "@app/components/auth/login";
import { type Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { createFileRoute } from "@tanstack/react-router";

const loginParamsSchema = Type.Object({
	redirect: Type.Optional(Type.String({ description: "The URL to redirect to after login" })),
});

type LoginParams = Static<typeof loginParamsSchema>;

const loginParams = TypeCompiler.Compile(loginParamsSchema);

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
	validateSearch: (value) => loginParams.Decode(value) as LoginParams,
});

function RouteComponent() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Login />
			</div>
		</div>
	);
}
