/// <reference types="vite/client" />
import appCss from '@styles/app.css?url';

import {createFileRoute, HeadContent, Outlet, Scripts} from "@tanstack/react-router";
import {lazy} from "react";
import {match, P} from "ts-pattern";
import {getAuthFromServer} from "@app/server/user.server";
import {EditorContextProvider} from "@app/context/editor.context";
const Overlay = lazy(() => import('@app/components/overlay/overlay-wrapper'));

export const Route = createFileRoute("/_public")({
	head: () => ({
		meta: [],
        links: [
            {
                rel: 'stylesheet',
                href: appCss
            }
        ]
	}),
	component: RouteComponent,
    loader: () => getAuthFromServer()
});

function RouteComponent() {

    const dataLoader = Route.useLoaderData();

	return (
		<>
			<HeadContent />
			<EditorContextProvider ctx={{enabled: dataLoader !== undefined}}>
                <Outlet />
                {match(dataLoader)
                    .with(P.nonNullable, (ctx) => (<div style={{ position: "fixed", bottom: 0, right: 0, zIndex: 9999 }}>
                        <Overlay ctx={ctx}/>
                    </div>))
                    .otherwise(() => null)}
            </EditorContextProvider>
            <Scripts/>
		</>
	);
}
