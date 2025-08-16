import { create } from 'zustand'
import {LayoutResponse} from "@neat/types/layout";
import {WidgetResponse} from "@neat/types/widget";
import {FC} from "react";

type EditorState = 'page' | 'widget';

export type SelectedWidget<T = any> = {
    widget: WidgetResponse;
    editor: FC<T>
}

type EditorStore = {
    state: EditorState;
    page: Page;
    selectedWidget?: SelectedWidget;
    changeState: (newState: EditorState) => void;
    registerPage: (page: Page) => void;
    setWidgetFocus: (widget: SelectedWidget) => void;
}

type Page = {
    id: string;
    slug: string;
    description?: string;
    layouts: {
        layout: LayoutResponse,
        widgets: WidgetResponse[]
    }[];
}

export const useEditorStore = create<EditorStore>((set) => ({
    state: 'page',
    layouts: [],
    changeState: (newState: EditorState) => set({ state: newState }),
    registerPage: (page) => {
        set({page})
    },
    setWidgetFocus: (widget) => set({selectedWidget: widget, state: 'widget'}),
    page: {
        id: '',
        slug: '',
        description: '',
        layouts: []
    }
}));