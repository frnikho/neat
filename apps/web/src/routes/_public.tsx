/// <reference types="vite/client" />
import appCss from '@styles/app.css?url';

import {createFileRoute, HeadContent, Outlet, Scripts} from "@tanstack/react-router";
import {lazy} from "react";
import {match, P} from "ts-pattern";
import {authFromServer, getAuthFromServer} from "@app/server/user.server";
import {EditorContextProvider} from "@app/context/editor.context";
import {apiClient} from "@app/lib/client";
import {useWidgetStore} from "@app/store/widget.store";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
const Overlay = lazy(() => import('@app/components/overlay/overlay-wrapper'));

export const Route = createFileRoute("/_public")({
	head: () => ({
		meta: [],
        links: [
            {
                rel: 'icon',
                href: '/favicon.ico',
            },
            {
                rel: 'stylesheet',
                href: appCss
            }
        ]
	}),
	component: RouteComponent,
    beforeLoad: ({location}) => {
        const pageId = location.pathname === '/' ? 'home' : location.pathname.slice(1);
         return apiClient.page({id: pageId}).get().then((({data, error}) => {
             return data!;
         })).catch((err) => {
             return null;
         });
    },
    loader: () => getAuthFromServer()
});

const queryClient = new QueryClient()

function RouteComponent() {
    const pageData = Route.useRouteContext()
    const dataLoader = Route.useLoaderData();
    console.log(dataLoader);
    const registerLayouts = useWidgetStore((s) => s.registerLayouts);

    registerLayouts(pageData!.page.layouts);

	return (
		<>
			<HeadContent />
                <EditorContextProvider ctx={{enabled: dataLoader !== null}}>
                    <QueryClientProvider client={queryClient}>
                        <ClientLayout/>
                        {match(dataLoader)
                            .with(P.nonNullable, (ctx) => (<div style={{ position: "fixed", bottom: 0, right: 0, zIndex: 9999 }}>
                                <Overlay ctx={ctx}/>
                            </div>))
                            .otherwise(() => null)}
                    </QueryClientProvider>
                </EditorContextProvider>
            <Scripts/>
		</>
	);
}

function ClientLayout() {
    return (<Outlet />)
}