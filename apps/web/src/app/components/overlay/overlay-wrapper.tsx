import {PropsWithChildren, useEffect, useRef} from "react";
import {createRoot} from "react-dom/client";
import {UserContext, UserContextProvider} from "@app/context/user.context";
import {Overlay} from "@app/components/overlay/overlay";
import {WidgetContextProvider} from "@app/context/widget.context";
import {WidgetState} from "@app/store/widget.store";
import {StoreApi} from "zustand";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

type Props = {
    ctx: UserContext;
    widget: StoreApi<WidgetState>;
}

export default function OverlayWrapper(props: Props) {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || ref.current.shadowRoot){
            return;
        }
        const shadow = ref.current.attachShadow({ mode: "open" });

        const styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href = "/overlay.css"; // build tailwind pour l’éditeur
        shadow.appendChild(styleLink);

        const styleTLink = document.createElement("link");
        styleTLink.rel = "stylesheet";
        styleTLink.href = "/theme.css"; // build tailwind pour l’éditeur
        shadow.appendChild(styleTLink);

        const mountPoint = document.createElement("div");
        shadow.appendChild(mountPoint);
        createRoot(mountPoint).render(<Overlay widget={props.widget} ctx={props.ctx}/>);

        return () => ref.current?.remove();
    }, []);

    return (<div ref={ref}/>);
}

const client = new QueryClient();

export function OverlayProvider({ctx, children, widget}: PropsWithChildren<{ctx: UserContext, widget: StoreApi<WidgetState>}>) {
    return (
        <QueryClientProvider client={client}>
            <WidgetContextProvider ctx={widget}>
                <UserContextProvider ctx={ctx}>
                    {children}
                </UserContextProvider>
            </WidgetContextProvider>
        </QueryClientProvider>
    )
}