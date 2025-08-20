import {FC} from "react";
import {TextWidget} from "@app/components/core/widget/text/text.widget";
import CardWidget from "@app/components/core/widget/card/card.widget";
import {CardSim, Pencil} from "lucide-react";

type WidgetRegistryEntry = {
    component: FC;
    key: string;
    label: string;
    description?: string;
    icon?: FC;
}

type Registry = {
    [key: string]: WidgetRegistryEntry;
}

const widgetRegistry: Registry = {
    text: {
        component: TextWidget,
        key: 'text',
        icon: Pencil,
        label: 'Text widget'
    },
    card: {
        component: CardWidget,
        key: 'card',
        icon: CardSim,
        label: 'Card widget',
    },
}

export const getWidgetRegistry = (): WidgetRegistryEntry[] => {
    return Object.keys(widgetRegistry).reduce<WidgetRegistryEntry[]>((acc, value) => {
        const widget = widgetRegistry[value];
        if (widget) {
            acc.push(widget);
        }
        return acc;
    }, []);
}

export default getWidgetRegistry;