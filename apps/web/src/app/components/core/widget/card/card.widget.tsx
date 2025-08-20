import {WidgetLoader} from "@app/components/core/widget/base/widget-provider";
import CardEditor from "@app/components/core/widget/card/card.editor";
import {ComponentProps} from "react";

export type CardWidgetProps = {
    title: string;
    description: string;
}

type Props = {
    wkey: string;
} & ComponentProps<"div">

export default function CardWidget({wkey, className, ...props}: Props) {
    return (
        <WidgetLoader<CardWidgetProps> Editor={CardEditor} wkey={wkey} defaultData={{title: 'Card title', description: 'Card description'}} children={(data) => (
            <div {...props} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{data.title}</h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">{data.description}</p>
            </div>
        )}/>
    )
}