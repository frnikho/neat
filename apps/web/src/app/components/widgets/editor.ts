import {ReactNode} from "react";
import {useMutation} from "@tanstack/react-query";
import {apiClient, apiRequest} from "@app/lib/client";
import {WidgetResponse} from "@neat/types/widget";
import {match, P} from "ts-pattern";
import {useEditorStore} from "@app/store/editor.store";
import useWidget from "@app/hooks/use-widget";

type ChildrenProps<T> = {
    update: (data: T) => void;
}

type ChildrenFn<T> = ({update}: ChildrenProps<T>) => ReactNode;

export function Editor<T>({widget, children}: {widget: WidgetResponse, children: ChildrenFn<T>}) {

    const {mutateAsync} = useMutation({mutationFn: (v: T) => apiRequest(apiClient.widget({id: widget.id}).put, {value: v})});
    const registerLayout = useWidget(s => s.registerLayouts)

    const reloadData = () => {
        const path = location.pathname === '/' ? 'home' : location.pathname.slice(1)
        console.log('path', path);
        return apiRequest(apiClient.page({id: path}).get, {}).then(({data, error}) => {
            match({data, error})
                .with({data: P.nonNullable}, ({data}) => {
                    console.log('registerPage');
                    registerLayout(data.page.layouts);
                })
                .otherwise(() => {});
        })
    }

    const updateWidget = (data: T) => {
        return mutateAsync(data).then(({data, error}) => {
            return match({data, error})
                .with({data: P.nonNullable, error: P.nullish}, async () => {
                    await reloadData()
                })
                .otherwise(({error}) => {
                    console.log(error);
                })
        })
    }

    return children({update: updateWidget})

}