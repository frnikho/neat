'use client';

import {usePathname} from "next/navigation";
import Link from "next/link";
import {SidebarMenuButton, SidebarMenuItem } from "@neat/ui";
import {MenuItem} from '@core/client/'

export default function SettingsMenuItem({item, prefix}: {item: MenuItem, prefix?: string}) {

    const url = prefix ? `/admin/${prefix}/${item.api_name}` : `/admin/${item.api_name}`;

    const pathname = usePathname()

    const isActive = () => {
        const normalize = (url: string) => url.replace(/\/+$/, "") || "/";
        return normalize(pathname) === normalize(url);
    }

    return (
        <SidebarMenuItem key={url}>
            <SidebarMenuButton isActive={isActive()} asChild>
                <Link href={url}>
                    {item.icon}
                    <span>{item.name}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}
