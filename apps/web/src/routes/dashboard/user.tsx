import ToolsHead from "@app/components/tools-head";
import { createFileRoute } from "@tanstack/react-router";
import {Static, Type} from "@sinclair/typebox";
import {TypeCheck, TypeCompiler} from "@sinclair/typebox/compiler";
import {Result} from "neverthrow";

const userParams = Type.Object({
    page: Type.Optional(Type.Number()),
    limit: Type.Optional(Type.Union([
        Type.Literal(20),
        Type.Literal(50),
        Type.Literal(100),
    ]))
});

type UserParams = Static<typeof userParams>;

const UserParams = TypeCompiler.Compile(userParams);

const decode = <T extends TypeCheck<any>,>(schema: T, value: unknown) => {
    return Result.fromThrowable(() => schema.Decode<T>(value), () => {})
}

export const Route = createFileRoute("/dashboard/user")({
	component: RouteComponent,
    validateSearch: (d) => {

        return decode(UserParams, d)().match((d) => {
            return d;
        }, () => ({
            page: 10,
            limit: 20
        }))

        /*const params = UserParams.Decode<UserParams>(d);
        params.page = !params.page ? 0 : params.page
        params.limit = !params.limit ? 20 : params.limit;
        return params;*/
    }
});

function RouteComponent() {

    /*const {page} = Route.useSearch();

    console.log(page)*/

	return (
		<>
			<ToolsHead items={[{ title: "Utilisateurs"}]}/>
		</>
	)
}
