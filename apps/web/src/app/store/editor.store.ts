import { create } from 'zustand'
import {WidgetResponse} from "@neat/types/widget";
import {FC} from "react";

type EditorState = 'page' | 'widget';

export type SelectedWidget<T = any> = {
    widget: WidgetResponse;
    editor: FC<T>
}

type EditorStore = {
    state: EditorState;
    selectedWidget?: SelectedWidget;
    changeState: (newState: EditorState) => void;
    setWidgetFocus: (widget: SelectedWidget) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    state: 'page',
    changeState: (newState: EditorState) => set({ state: newState }),
    setWidgetFocus: (widget) => set({selectedWidget: widget, state: 'widget'}),
}));