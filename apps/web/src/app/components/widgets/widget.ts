import {useWidgetStore} from "@app/store/widget.store";
import {ReactNode, useEffect} from "react";
import {apiClient} from "@app/lib/client";
import {useMutation} from "@tanstack/react-query";

export type WidgetProps<T> = {
    wkey: string,
    defaultData: T,
}

export function Widget<T>({wkey, children, defaultData}: WidgetProps<T> & {children: (data: T) => ReactNode}) {
    const getWidgetByKey = useWidgetStore((e) => e.getWidgetByKey);
    const {mutate: createWidget} = useMutation({mutationFn: () => apiClient.widget.post({key: wkey, value: defaultData, name: `${wkey}`, layout: 'nzaherlfdhbedh'})})

    const widget = getWidgetByKey(wkey);

    useEffect(() => {
        console.log(getWidgetByKey(wkey));
        if (!getWidgetByKey(wkey)) {
            console.log('Widget not found, creating new widget:', wkey);
            createWidget();
        }
    }, []);

    return children(widget?.value ?? defaultData);
}