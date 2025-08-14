import { create } from 'zustand'

type EditorState = 'page' | 'widget';

type EditorStore = {
    state: EditorState;
    changeState: (newState: EditorState) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    state: 'page',
    changeState: (newState: EditorState) => set({ state: newState }),
}));