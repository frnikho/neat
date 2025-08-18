import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@app/lib/client'
import {cloneElement, isValidElement, ReactElement, ReactNode, useEffect} from 'react'
import {WidgetProps} from "@app/components/widgets/base/widget";
import {useEditorStore} from "@app/store/editor.store";
import useWidget from "@app/hooks/use-widget";

export default function WidgetEditor<T>({ wkey, children, defaultData, Editor, dev }: WidgetProps<T> & {
    children: (data: T) => ReactNode
}) {
    const widget = useWidget((s) => s.layouts.flatMap(l => l.widgets).find(w => wkey === w.key));
    const setWidgetFocus = useEditorStore((s) => s.setWidgetFocus);

    const {mutate: createWidget} = useMutation({
        mutationFn: () => apiClient.widget.post({key: wkey, value: defaultData, name: `${wkey}`, layout: 'nzaherlfdhbedh'})
    })

    useEffect(() => {
        if (!widget && !dev) {
            createWidget()
        }
    }, [widget]);

    const onClick = () => {
        console.log('onClick');
        if (widget) {
            setWidgetFocus({widget, editor: Editor});
        } else {
            console.log('Widget not found, creating new one');
        }
    };

    const comp = children(widget?.value ?? defaultData);

    if (isValidElement(comp)) {
        const el = comp as ReactElement<any>;

        return cloneElement(comp as ReactElement, {
            ...el.props,
            className: [
                "hover:outline-dashed hover:outline-2 hover:outline-blue-500 cursor-pointer",
                (comp.props as any).className, // merge si déjà une className
            ].filter(Boolean).join(" "),
            onClick,
        });
    }
    console.log('not valid element')
    return null;
}