import {FC, ReactNode, useEffect} from "react";
import {apiClient} from "@app/lib/client";
import {useMutation} from "@tanstack/react-query";
import {WidgetResponse} from "@neat/types/widget";
import useWidget from "@app/hooks/use-widget";

export type WidgetProps<T> = {
    wkey: string,
    defaultData: T,
    dev?: boolean,
    Editor?: FC<{wkey: string, data: T, widget: WidgetResponse}>;
}

export function Widget<T>({wkey, children, defaultData, dev}: WidgetProps<T> & {children: (data: T) => ReactNode}) {
    const layouts = useWidget((s) => s.layouts);
    const {mutate: createWidget} = useMutation({mutationFn: () => apiClient.widget.post({key: wkey, value: defaultData, name: `${wkey}`, layout: 'nzaherlfdhbedh'})})

    const widget = layouts.find(layout => layout.widgets.some(widget => widget.key === wkey))?.widgets.find(widget => widget.key === wkey);

    useEffect(() => {
        if (!widget && !dev) {
            console.log('Widget not found, creating new widget:', wkey);
            createWidget();
        }
    }, []);

    return children(widget?.value ?? defaultData);
}