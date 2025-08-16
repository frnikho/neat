import {useWidgetStore} from "@app/store/widget.store";
import {FC, ReactNode, useEffect} from "react";
import {apiClient} from "@app/lib/client";
import {useMutation} from "@tanstack/react-query";
import {WidgetResponse} from "@neat/types/widget";

export type WidgetProps<T> = {
    wkey: string,
    defaultData: T,
    dev?: boolean,
    Editor: FC<{wkey: string, data: T, widget: WidgetResponse}>;
}

export function Widget<T>({wkey, children, defaultData, dev}: WidgetProps<T> & {children: (data: T) => ReactNode}) {
    const getWidgetByKey = useWidgetStore((e) => e.getWidgetByKey);
    const {mutate: createWidget} = useMutation({mutationFn: () => apiClient.widget.post({key: wkey, value: defaultData, name: `${wkey}`, layout: 'nzaherlfdhbedh'})})

    const widget = getWidgetByKey(wkey);

    useEffect(() => {
        console.log(getWidgetByKey(wkey));
        if (!getWidgetByKey(wkey) && !dev) {
            console.log('Widget not found, creating new widget:', wkey);
            createWidget();
        }
    }, []);

    return children(widget?.value ?? defaultData);
}