import {ComponentProps} from "react";
import {WidgetProps} from "@app/components/widgets/widget";
import {WidgetLoader} from "@app/components/widgets/widget-provider";

type TextWidgetProps = {
    fr: string;
    en?: string;
}

export function TextWidget({wkey, defaultData, ...props}: ComponentProps<"p"> & WidgetProps<TextWidgetProps>) {

    const language = 'fr'; // This should be dynamically determined based on user preference or context

    return (
        <WidgetLoader<TextWidgetProps> wkey={wkey} defaultData={defaultData} children={(data) => (
                <p {...props}>
                {data[language]}
            </p>
        )}/>
    )
}

