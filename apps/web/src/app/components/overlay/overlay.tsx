import {UserContext} from "@app/context/user.context";
import {OverlayProvider} from "@app/components/overlay/overlay-wrapper";
import {useEditorStore} from "@app/store/editor.store";
import {match} from "ts-pattern";
import OverlayPage from "@app/components/overlay/overlay-page";
import OverlayWidget from "@app/components/overlay/overlay-widget";

type Props = {
    ctx: UserContext
}

export function Overlay(props: Props) {

    const {state, selectedWidget} = useEditorStore();

    console.log(selectedWidget);

    return (
        <OverlayProvider ctx={props.ctx}>
           <div className={'m-4 transition-all opacity-60 hover:opacity-100'}>
               {match(state)
                   .with('page', () => OverlayPage())
                   .with('widget', () => OverlayWidget())
                   .exhaustive()}
           </div>
        </OverlayProvider>
    )
}