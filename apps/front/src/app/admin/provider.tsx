'use client';

import {ReactNode} from "react";
import { SidebarProvider } from "@neat/ui/components/sidebar.js";
import { UserContext } from "@/contexts/user";
import {ThemeProvider} from "@/components/providers/theme-provider";

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
                <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
                    {children}
                </ThemeProvider>
            </SidebarProvider>
        </UserContext.Provider>
    )
}