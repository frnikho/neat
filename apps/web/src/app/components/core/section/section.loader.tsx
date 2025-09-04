import {lazy, ReactNode, Suspense, useContext} from 'react'
import {EditorContext} from "@app/context/editor.context";
import {SectionEditor} from "@app/components/core/section/section.editor";
import Section, {SectionProps} from "@app/components/core/section/section";

export function SectionLoader<T>(props: SectionProps & {
    children: (data: T) => ReactNode
}) {
    const { enabled } = useContext(EditorContext);

    if (enabled) {
        return (
            <Suspense fallback={null}>
                <SectionEditor {...props} />
            </Suspense>
        )
    }

    return props.children('' as T);
}