import Register from "@app/components/auth/register";
import { type Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { TypeSystemPolicy } from "@sinclair/typebox/system";
import { createFileRoute } from "@tanstack/react-router";

const registerParamsSchema = Type.Object({
	token: Type.Optional(Type.String({ description: "The registration token" })),
});

type RegisterParams = Static<typeof registerParamsSchema>;

const registerParams = TypeCompiler.Compile(registerParamsSchema);

export const Route = createFileRoute("/auth/register")({
	component: RouteComponent,
	validateSearch: (value) => registerParams.Decode(value) as RegisterParams,
});

function RouteComponent() {
	const { token } = Route.useSearch();
	if (!token) {
		return (
			<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
				<div className="w-full max-w-sm">
					<h1 className="mb-4 font-bold text-2xl">Registration Required</h1>
					<p>Please provide a valid registration token to continue.</p>
				</div>
			</div>
		);
	}
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-md">
				<Register token={token} />
			</div>
		</div>
	);
}
