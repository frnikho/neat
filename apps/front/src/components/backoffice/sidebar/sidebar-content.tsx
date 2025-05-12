'use client';

import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem} from "@neat/ui";
import { Calendar, Check, Home, Inbox, Search, Settings } from "lucide-react"
import Link from "next/link";

import { usePathname } from 'next/navigation'
import {modules} from "$app";
import {getAllGroups, getAllMenu} from "@/lib/module";

const items = [
    {
        title: "Home",
        url: "/admin/",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "/admin/inbox",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "/admin/calendar",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "/admin/search",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
]

export default function AppSidebarContent() {

    const pathname = usePathname()

    const isActive = (url: string) => {
        const normalize = (url: string) => url.replace(/\/+$/, "") || "/";
        return normalize(pathname) === normalize(url);
    }

    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {getAllMenu()}
                    </SidebarMenu>
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton isActive={isActive(item.url)} asChild>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}