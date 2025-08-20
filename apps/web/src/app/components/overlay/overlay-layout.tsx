import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@app/components/ui/card";
import {useEditorStore} from "@app/store/editor.store";
import widgetRegistry, {getWidgetRegistry} from "@app/components/core/widget/registry";

export default function OverlayLayout() {

    const section = useEditorStore(s => s.selectedSection?.layout);

    if (!section) {
        return <Card>
            <CardContent>
                <div className="text-center text-gray-500">No layout selected</div>
            </CardContent>
        </Card>
    }

    console.log(getWidgetRegistry());

    return (
        <div className={'flex flex-col gap-4'}>
            <Card className="min-w-xs max-w-md">
                <CardHeader>
                    <CardTitle>Paramètre de la section {section.layout.key}</CardTitle>
                    <CardDescription className={'text-xs'}>widgets: {section.widgets.length}</CardDescription>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Ajouter un widget</CardTitle>
                </CardHeader>
                <CardContent className={'grid grid-cols-2 gap-4'}>
                    {getWidgetRegistry().map((wr) => (
                        <Card>
                            <CardContent onClick={() => {
                                wr.component
                            }}>{wr.label}</CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}