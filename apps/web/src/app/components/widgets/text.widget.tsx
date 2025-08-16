import {ComponentProps, lazy} from "react";
import {WidgetProps} from "@app/components/widgets/widget";
import {WidgetLoader} from "@app/components/widgets/widget-provider";

const TextWidgetEditor = lazy(() => import('./text.editor'));

export type TextWidgetProps = {
    fr: string;
    en?: string;
}

export function TextWidget({...props}: ComponentProps<"p"> & Omit<WidgetProps<TextWidgetProps>, 'Editor'>) {

    const language = 'fr'; // This should be dynamically determined based on user preference or context

    const {defaultData, ...otherProps} = props

    return (
        <WidgetLoader<TextWidgetProps> dev {...props} Editor={TextWidgetEditor} children={(data) => (
            <p {...otherProps}>
                {data[language]}
            </p>
        )}/>
    )
}