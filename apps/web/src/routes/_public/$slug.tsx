import { createFileRoute } from '@tanstack/react-router'
import {apiClient} from "@app/lib/client";

export const Route = createFileRoute('/_public/$slug')({
  component: RouteComponent,
    loader: ({params}) => {
        apiClient.page({slug: params.slug}).get().then(({data, error}) => {
            console.log(`Page loaded: ${params.slug}`);
            console.log('DATA: ', data);
            console.log('ERROR: ', error);
        })
    }
})

function RouteComponent() {
  return <div>Hello "/_public/$slug"!</div>
}
