import {UserContext} from "@app/context/user.context";
import {OverlayProvider} from "@app/components/overlay/overlay-wrapper";
import {useEditorStore} from "@app/store/editor.store";
import {match} from "ts-pattern";
import OverlayPage from "@app/components/overlay/overlay-page";
import OverlayWidget from "@app/components/overlay/overlay-widget";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

type Props = {
    ctx: UserContext
}

const client = new QueryClient();

export function Overlay(props: Props) {

    const state = useEditorStore((s) => s.state);

    return (
        <QueryClientProvider client={client}>
            <OverlayProvider ctx={props.ctx}>
                <div className={'m-4 transition-all opacity-60 hover:opacity-100'}>
                    {match(state)
                        .with('page', () => <OverlayPage/>)
                        .with('widget', () => <OverlayWidget/>)
                        .exhaustive()}
                </div>
            </OverlayProvider>
        </QueryClientProvider>
    )
}