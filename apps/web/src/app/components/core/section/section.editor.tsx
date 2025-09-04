import {SectionProps} from "@app/components/core/section/section";
import useWidget from "@app/hooks/use-widget";
import {useEffect} from "react";
import {apiClient} from "@app/lib/client";
import {useMutation} from "@tanstack/react-query";
import {useEditorStore} from "@app/store/editor.store";

export function SectionEditor(props: SectionProps & {dev?: boolean}) {

    const layout = useWidget((s) => s.layouts.find(({layout}) => layout.key === props.lkey));
    const setSectionFocus = useEditorStore((s) => s.setSectionFocus);

    const {mutate: createLayout} = useMutation({
        mutationFn: () => apiClient.layout.post({key: props.lkey, name: `${props.lkey}`, page: 'bfps6hiynypk'})
    });

    console.log(layout);

    const onClick = () => {
        if (layout) {
            setSectionFocus({layout: layout});
        } else {
            console.log('Layout not found, creating new one');
        }
    }

    useEffect(() => {
        if (!layout && !props.dev) {
            createLayout();
        }
    }, [layout]);

    return (
        <div className={'hover:outline-2 hover:outline-dashed hover:outline-blue-500 cursor-pointer'} onClick={onClick}>
            {layout?.widgets.map((w) => (
                <div>
                    {w.key}
                </div>
            ))}
            {layout?.layout.key}
        </div>
    )
}