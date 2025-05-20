'use client';

import {ReactNode} from "react";
import { SidebarProvider } from "@neat/ui/components/sidebar.js";
import { UserContext } from "@/contexts/user";

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
        <UserContext.Provider value={user}>
            <SidebarProvider>
                {children}
            </SidebarProvider>
        </UserContext.Provider>
    )
}