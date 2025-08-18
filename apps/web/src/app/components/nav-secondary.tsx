import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@app/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import {Link} from "@tanstack/react-router";
import {UserContext} from "@app/context/user.context";
import {hasPermissions} from "@app/lib/permision";
import {AllPermissions} from "@neat/types/permission";

export function NavSecondary({
	items,
    ctx,
	...props
}: {
    ctx: UserContext;
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
        permission?: AllPermissions;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => {
                        if (item.permission && !hasPermissions(ctx, 'dashboard.*', item.permission)) {
                            return null;
                        }
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild size="sm">
                                    <Link to={item.url}>
                                        {item.icon ? <item.icon/> : null}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
