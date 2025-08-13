import {createFileRoute, useNavigate} from '@tanstack/react-router'

import {Static, Type} from "@sinclair/typebox";
import {TypeCompiler} from "@sinclair/typebox/compiler";
import Role from "@app/components/settings/role";

const roleParamsSchema = Type.Object({
    page: Type.Optional(Type.Integer()),
    limit: Type.Optional(Type.Integer()),
});

type RoleParams = Static<typeof roleParamsSchema>;

const roleParams = TypeCompiler.Compile(roleParamsSchema);

export const Route = createFileRoute('/dashboard/settings/role')({
    component: RouteComponent,
    validateSearch: (d) => roleParams.Decode<RoleParams>(d)
})

function RouteComponent() {

    const {page, limit} = Route.useSearch();

    return <Role limit={limit} page={page}/>
}