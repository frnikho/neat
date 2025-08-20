import {UserContext} from "@app/context/user.context";
import {OverlayProvider} from "@app/components/overlay/overlay-wrapper";
import {useEditorStore} from "@app/store/editor.store";
import {match} from "ts-pattern";
import OverlayPage from "@app/components/overlay/overlay-page";
import OverlayWidget from "@app/components/overlay/overlay-widget";
import {StoreApi} from "zustand";
import {WidgetState} from "@app/store/widget.store";
import OverlaySettings from "@app/components/overlay/overlay-settings";
import OverlayLayout from "@app/components/overlay/overlay-layout";

type Props = {
    ctx: UserContext;
    widget: StoreApi<WidgetState>;
}

export function Overlay(props: Props) {

    const state = useEditorStore((s) => s.state);

    return (
        <OverlayProvider ctx={props.ctx} widget={props.widget} >
            <div className={'transition-all opacity-60 hover:opacity-100 overflow-y-auto no-scrollbar h-screen py-4 pr-4 flex flex-col gap-4'}>
                {match(state)
                    .with('page', () => <OverlayPage/>)
                    .with('widget', () => <OverlayWidget/>)
                    .with('layout', () => <OverlayLayout/>)
                    .exhaustive()}
                <OverlaySettings/>
            </div>
        </OverlayProvider>
    )
}