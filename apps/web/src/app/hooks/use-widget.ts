import { useStore } from 'zustand'
import { useContext } from 'react'
import {WidgetState, WidgetStore} from "@app/store/widget.store";
import {WidgetContext} from "@app/context/widget.context";

export default function useWidget<T>(selector: (state: WidgetState) => T): T {
    const store = useContext(WidgetContext) as WidgetStore
    return useStore(store, selector)
}