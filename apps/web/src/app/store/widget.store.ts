import {createStore} from "zustand";
import {LayoutResponse} from "@neat/types/layout";
import {WidgetResponse} from "@neat/types/widget";

export type LayoutWithWidgets = {
    layout: LayoutResponse,
    widgets: WidgetResponse[]
}

export type WidgetState = {
    layouts: LayoutWithWidgets[];
    registerLayouts: (layouts: LayoutWithWidgets[]) => void;
}

export type WidgetStore = ReturnType<typeof createWidgetStore>

export const createWidgetStore = (layouts: LayoutWithWidgets[]) => {
    return createStore<WidgetState>()((set) => ({
        layouts: layouts,
        registerLayouts: (layouts) => {
            set({layouts});
        },
    }))
}