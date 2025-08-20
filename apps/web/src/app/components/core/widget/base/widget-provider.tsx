import {lazy, ReactNode, Suspense, useContext} from 'react'
import {Widget, WidgetProps} from "@app/components/core/widget/base/widget";
import {EditorContext} from "@app/context/editor.context";

const WidgetEditor = lazy(() => import('./widget-editor'))

export function WidgetLoader<T>(props: WidgetProps<T> & {
    children: (data: T) => ReactNode
}) {
    const { enabled } = useContext(EditorContext);

    if (enabled) {
        return (
            <Suspense fallback={null}>
                <WidgetEditor {...props} />
            </Suspense>
        )
    }

    return <Widget {...props} />
}