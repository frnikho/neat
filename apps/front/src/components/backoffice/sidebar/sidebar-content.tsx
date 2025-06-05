'use client';

import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem} from "@neat/ui";
import {Home, NewspaperIcon, Search, Settings, Users} from "lucide-react"
import Link from "next/link";

import { usePathname } from 'next/navigation'
import {getAllMenu} from "@/lib/module";

const items = [
    {
        title: "Home",
        url: "/admin/",
        icon: Home,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Roles",
        url: "/admin/roles",
        icon: NewspaperIcon,
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
                    <SidebarMenu>
                        {getAllMenu()}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}