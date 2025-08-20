import { create } from 'zustand'
import {WidgetResponse} from "@neat/types/widget";
import {FC} from "react";
import {LayoutWithWidgets} from "@app/store/widget.store";

type EditorState = 'page' | 'widget' | 'layout';

export type SelectedWidget<T = any> = {
    widget: WidgetResponse;
    editor: FC<T> | undefined;
}

export type SelectedSection = {
    layout: LayoutWithWidgets;
}

type EditorStore = {
    state: EditorState;
    selectedWidget?: SelectedWidget;
    selectedSection?: SelectedSection;
    changeState: (newState: EditorState) => void;
    setWidgetFocus: (widget: SelectedWidget) => void;
    setSectionFocus: (section: SelectedSection) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    state: 'page',
    changeState: (newState: EditorState) => set({ state: newState }),
    setWidgetFocus: (widget) => set({selectedWidget: widget, state: 'widget'}),
    setSectionFocus: (section) => set({selectedSection: section, state: 'layout'})
}));