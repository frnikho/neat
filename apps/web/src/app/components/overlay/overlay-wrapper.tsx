import {PropsWithChildren, useEffect, useRef} from "react";
import {createRoot} from "react-dom/client";
import {UserContext, UserContextProvider} from "@app/context/user.context";
import {Overlay} from "@app/components/overlay/overlay";

type Props = {
    ctx: UserContext
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
        createRoot(mountPoint).render(<Overlay ctx={props.ctx}/>);

        return () => ref.current?.remove();
    }, []);

    return (<div ref={ref}/>);
}

export function OverlayProvider({ctx, children}: PropsWithChildren<{ctx: UserContext}>) {
    return (
        <UserContextProvider ctx={ctx}>
            {children}
        </UserContextProvider>
    )
}