'use client';

import {ReactNode} from "react";
import { SidebarProvider } from "@neat/ui/components/sidebar.js";

type Props = {
    children: ReactNode,
    user: {
        id: string;
        email: string;
        firstname: string;
        lastname: string;
    }
}

export default function Provider({ children, user }: Props) {
    return (
        <SidebarProvider>
            {children}
        </SidebarProvider>
    )
}