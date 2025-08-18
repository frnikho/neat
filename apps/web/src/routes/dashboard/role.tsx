import {createFileRoute, useNavigate} from '@tanstack/react-router'

import {Static, Type} from "@sinclair/typebox";
import {TypeCompiler} from "@sinclair/typebox/compiler";
import Role from "@app/components/settings/role";
import ToolsHead from "@app/components/tools-head";

const roleParamsSchema = Type.Object({
    page: Type.Optional(Type.Integer()),
    limit: Type.Optional(Type.Integer()),
    id: Type.Optional(Type.String())
});

type RoleParams = Static<typeof roleParamsSchema>;

const roleParams = TypeCompiler.Compile(roleParamsSchema);

export const Route = createFileRoute('/dashboard/role')({
    component: RouteComponent,
    validateSearch: (d) => roleParams.Decode<RoleParams>(d)
})

function RouteComponent() {

    const {page, limit} = Route.useSearch();

    return (
        <>
            <ToolsHead items={[{ title: "Roles et permissions"}]}/>
            <Role limit={limit} page={page}/>
        </>
    )
}