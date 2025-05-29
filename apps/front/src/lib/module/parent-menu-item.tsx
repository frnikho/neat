'use client'

import Link from "next/link";
import SettingsMenuItem from "@/lib/module/menu-item";
import { ParentMenuItem } from "@neat/core/client";
import {SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@neat/ui";
import {usePathname} from "next/navigation";

export default function SettingsParentMenuItem({item}: { item: ParentMenuItem }) {

    const pathname = usePathname()

    const isActive = () => {
        const normalize = (url: string) => url.replace(/\/+$/, "") || "/";
        return normalize(pathname) === normalize(`/admin/${item.api_name}`);
    }

    const showLink = () => {
        return (
            <Link href={`/admin/${item.api_name}`}>
                {item.icon}
                <span>{item.name}</span>
            </Link>
        )
    }

    const showDiv = () => {
        return (
            <div>
                {item.icon}
                <span>{item.name}</span>
            </div>
        )
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton isActive={isActive()} asChild>
                {item.page !== undefined ? showLink() : showDiv()}
            </SidebarMenuButton>
            <SidebarMenuSub>
                {item.items.map((i) => <SettingsMenuItem key={i.api_name} item={i} prefix={item.api_name}/>)}
            </SidebarMenuSub>
        </SidebarMenuItem>
    )
}