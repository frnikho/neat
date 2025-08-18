/// <reference types="vite/client" />
import appCss from '@styles/app.css?url';

import {createFileRoute, HeadContent, Outlet, Scripts} from "@tanstack/react-router";
import {lazy, useRef} from "react";
import {match, P} from "ts-pattern";
import {getAuthFromServer} from "@app/server/user.server";
import {EditorContextProvider} from "@app/context/editor.context";
import {apiClient} from "@app/lib/client";
import {createWidgetStore} from "@app/store/widget.store";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {WidgetContextProvider} from "@app/context/widget.context";
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
         return apiClient.page({id: pageId}).get().then((({data}) => {
             return data!;
         })).catch((err) => {
             return null;
         });
    },
    loader: () => getAuthFromServer(),
});

const queryClient = new QueryClient()

function RouteComponent() {
    const pageData = Route.useRouteContext()
    const dataLoader = Route.useLoaderData();

    console.log(pageData!.layouts);

    const store = useRef(createWidgetStore(pageData!.layouts)).current

    return (
		<WidgetContextProvider ctx={store}>
			<HeadContent />
                <EditorContextProvider ctx={{enabled: dataLoader !== null}}>
                    <QueryClientProvider client={queryClient}>
                        <Outlet />
                        {match(dataLoader)
                            .with(P.nonNullable, (ctx) => (<div style={{ position: "fixed", top: 0, right: 0, zIndex: 9999 }}>
                                <Overlay widget={store} ctx={ctx}/>
                            </div>))
                            .otherwise(() => null)}
                    </QueryClientProvider>
                </EditorContextProvider>
            <Scripts/>
		</WidgetContextProvider>
	);
}