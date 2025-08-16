import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@app/components/ui/card";
import {useEditorStore} from "@app/store/editor.store";
import {Button} from "@app/components/ui/button";
import {useShallow} from "zustand/react/shallow";
import {Suspense} from "react";

export default function OverlayWidget() {

    const {widget, Editor, changeState} = useEditorStore(useShallow((s => ({Editor: s.selectedWidget?.editor, widget: s.selectedWidget?.widget, changeState: s.changeState}))));

    if (!widget || !Editor) {
        return null;
    }

    return (
        <div className={"flex flex-col gap-4"}>
            <Card>
                <CardContent className={'flex w-full flex-row'}>
                    <Button variant={'outline'} onClick={() => changeState('page')}>Retour</Button>
                </CardContent>
            </Card>
            <Card className="min-w-xs max-w-md">
                <CardHeader>
                    <CardTitle>{widget.name}</CardTitle>
                    <CardDescription className={'text-xs'}>
                        {JSON.stringify(widget.value)}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={null}>
                        <Editor widget={widget} data={widget.value}/>
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}