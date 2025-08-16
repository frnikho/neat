import {createContext, ReactNode} from 'react'
import {WidgetStore} from "@app/store/widget.store";

export const WidgetContext = createContext<WidgetStore>(undefined as never);

export function WidgetContextProvider({ ctx, children }: { ctx: WidgetStore; children: ReactNode }) {
    return <WidgetContext.Provider value={ctx}>{children}</WidgetContext.Provider>
}