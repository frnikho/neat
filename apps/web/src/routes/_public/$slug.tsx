import {createFileRoute} from '@tanstack/react-router'
import {apiClient} from "@app/lib/client";
import {match} from "ts-pattern";

export const Route = createFileRoute('/_public/$slug')({
    component: RouteComponent,
    loader: ({params}) => {
        return apiClient.page({slug: params.slug}).get().then(({data, error}) => {
            console.log(`Page loaded: ${params.slug}`);
            console.log('DATA: ', data);
            console.log('ERROR: ', error);
            return data!;
        })
    },
    head: (ctx) => {
        if (!ctx.loaderData) {
            console.log('abc');
            return {}
        }
        return {
            meta: [{
                title: ctx.loaderData.page.slug,
            }]
        }
    }
})

function RouteComponent() {
    return <div>Hello "/_public/$slug"!</div>
}
