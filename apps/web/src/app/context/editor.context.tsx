import {createContext, PropsWithChildren} from "react";

export type EditorContext = {
    enabled: boolean;
}

export const UserContext = createContext<EditorContext>(undefined as never);

export function EditorContextProvider({ctx, children}: PropsWithChildren<{ctx: EditorContext}>) {
    return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>;
}