'use client';

import {SidebarProvider, SidebarTrigger} from "@neat/ui/components/sidebar.js";
import { ReactNode } from "react";
import SidebarApp from "./sidebar";

export default function SidebarLayout({ children }: { children: ReactNode }) {

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