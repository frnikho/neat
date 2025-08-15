import {createFileRoute} from '@tanstack/react-router'
import {apiClient} from "@app/lib/client";
import {getRouteComponent, registerPage} from "@app/page.registry";
import { lazy, Suspense } from 'react';

export const Route = createFileRoute('/_public/$slug')({
    component: RouteComponent,
    loader: ({params}) => {
        /*return apiClient.page({slug: params.slug}).get().then(({data, error}) => {
            return data!;
        })*/
    },
    head: (ctx) => {
        if (!ctx.loaderData) {
            return {}
        }
        return {
            /*meta: [{title: ctx.loaderData.page.slug}]*/
        }
    }
});

/*
registerPage("home", () => import("../../customer/routes/index"));
registerPage("profile", () => import("../../customer/routes/profile"));
registerPage("settings", () => import("../../customer/routes/settings"));
*/

function RouteComponent() {

    const data = Route.useLoaderData();
   /* const loader = getRouteComponent(data.page.slug);
    const Page = lazy(loader);*/
    return (
        <div>abc</div>
        /*<Layout>
            <Page {...data} />
        </Layout>*/)
}
