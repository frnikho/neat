import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@app/lib/client'
import {ReactNode, useEffect} from 'react'
import {WidgetProps} from "@app/components/widgets/widget";
import {useEditorStore} from "@app/store/editor.store";
import useWidget from "@app/hooks/use-widget";

export default function WidgetEditor<T>({ wkey, children, defaultData, Editor }: WidgetProps<T> & {
    children: (data: T) => ReactNode
}) {
    const widget = useWidget((s) => s.layouts.flatMap(l => l.widgets).find(w => wkey === w.key));
    const setWidgetFocus = useEditorStore((s) => s.setWidgetFocus);

    const {mutate: createWidget} = useMutation({
        mutationFn: () => apiClient.widget.post({key: wkey, value: defaultData, name: `${wkey}`, layout: 'nzaherlfdhbedh'})
    })

    useEffect(() => {
        if (!widget) {
            createWidget()
        }
    }, [widget, createWidget]);

    const onClick = () => {
        if (widget) {
            setWidgetFocus({widget, editor: Editor});
        }
    };

    return <div className={'hover:outline-dashed hover:outline-2 hover:outline-blue-500 w-fit cursor-pointer'} onClick={onClick}>{children(widget?.value ?? defaultData)}</div>;
}