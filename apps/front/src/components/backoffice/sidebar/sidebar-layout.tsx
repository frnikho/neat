import {SidebarProvider, SidebarTrigger} from "@neat/ui";
import { ReactNode } from "react";
import SidebarApp from "./sidebar";

export default async function SidebarLayout({ children }: { children: ReactNode }) {

    return (
        <SidebarProvider>
            <SidebarApp/>
            <main>
                <SidebarTrigger/>
                {children}
            </main>
        </SidebarProvider>
    )
}