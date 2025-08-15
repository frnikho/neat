import {create} from "zustand";
import {LayoutResponse} from "@neat/types/layout";
import {WidgetResponse} from "@neat/types/widget";

type LayoutWithWidgets = {
    layout: LayoutResponse,
    widgets: WidgetResponse[]
}

type WidgetStore = {
    layouts: LayoutWithWidgets[];
    registerLayouts: (layouts: LayoutWithWidgets[]) => void;
    getWidgetByKey: (key: string) => WidgetResponse | undefined;
}

export const useWidgetStore = create<WidgetStore>((set, get) => ({
    layouts: [],
    registerLayouts: (layouts) => {
        set({layouts});
    },
    getWidgetByKey: (key: string) => {
        const layoutWithWidgets = get().layouts.find(layout =>
            layout.widgets.some(widget => widget.key === key)
        );
        if (layoutWithWidgets) {
            return layoutWithWidgets.widgets.find(widget => widget.key === key);
        }
        return undefined;
    }
}));