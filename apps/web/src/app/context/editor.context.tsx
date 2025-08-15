import {createContext, PropsWithChildren} from "react";

export type EditorContext = {
    enabled: boolean;
}

export const EditorContext = createContext<EditorContext>(undefined as never);

export function EditorContextProvider({ctx, children}: PropsWithChildren<{ctx: EditorContext}>) {
    return <EditorContext.Provider value={ctx}>{children}</EditorContext.Provider>;
}