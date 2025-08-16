import {UserContext} from "@app/context/user.context";
import {OverlayProvider} from "@app/components/overlay/overlay-wrapper";
import {useEditorStore} from "@app/store/editor.store";
import {match} from "ts-pattern";
import OverlayPage from "@app/components/overlay/overlay-page";
import OverlayWidget from "@app/components/overlay/overlay-widget";
import {StoreApi} from "zustand";
import {WidgetState} from "@app/store/widget.store";

type Props = {
    ctx: UserContext;
    widget: StoreApi<WidgetState>;
}

export function Overlay(props: Props) {

    const state = useEditorStore((s) => s.state);

    return (
        <OverlayProvider ctx={props.ctx} widget={props.widget}>
            <div className={'m-4 transition-all opacity-60 hover:opacity-100'}>
                {match(state)
                    .with('page', () => <OverlayPage/>)
                    .with('widget', () => <OverlayWidget/>)
                    .exhaustive()}
            </div>
        </OverlayProvider>
    )
}