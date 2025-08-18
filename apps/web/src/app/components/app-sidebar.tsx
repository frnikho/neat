import { NavMain } from "@app/components/nav-main";
import { NavSecondary } from "@app/components/nav-secondary";
import { NavUser } from "@app/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@app/components/ui/sidebar";
import {
    AppWindowIcon,
    Boxes,
    Command, Cuboid, File,
    Library,
    LifeBuoy, LucideIcon,
    NotebookText,
    Settings,
    User
} from "lucide-react";
import type * as React from "react";
import { useAuth } from "@app/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { getCompanySettings } from "@app/server/settings.server";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { match, P } from "ts-pattern";
import { Skeleton } from "@app/components/ui/skeleton";
import {useNavigate} from "@tanstack/react-router";
import {AllPermissions} from "@neat/types/permission";

type SecondaryItem = {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    permissions?: AllPermissions[];
}

export type PrimaryItem = {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: SecondaryItem[];
    permissions?: AllPermissions[];
}


const navSecondary: SecondaryItem[] = [
    {
        title: 'Paramètre',
        url: '/dashboard/settings',
        icon: Settings,
        permissions: ['settings.*'],
    },
    {
        title: 'Support',
        url: '/dashboard/about',
        icon: LifeBuoy,
    }
]

const adminItems: PrimaryItem[] = [
    {
        title: 'Page',
        url: '/dashboard/page',
        icon: File,
        permissions: ['page.*'],
    },
    {
        title: 'Bibliothèque',
        url: '/dashboard/library',
        icon: Library,
        permissions: ['file.*']
    },
    {
        title: 'Utilisateurs',
        icon: User,
        url: '/dashboard/user',
        permissions: ['user.*']
    },
    {
        title: 'Roles et permissions',
        icon: NotebookText,
        url: '/dashboard/role',
        permissions: ['role.*']
    },
    {
        title: 'Application',
        icon: AppWindowIcon,
        url: '/dashboard/settings/company',
    },
    {
        title: 'Environnements',
        icon: Boxes,
        url: '/dashboard/env/'
    },
    {
        title: 'Modules',
        icon: Cuboid,
        url: '/dashboard/modules/',
    }
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user, roles } = useAuth();
    const navigate = useNavigate();

	const getSettingsFn = useServerFn(getCompanySettings);

	const {
		data: company,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["company_settings"],
		queryFn: () => getSettingsFn(),
	});

    const onClickEditor = useCallback(() => {
        return navigate({to: '/', reloadDocument: true});
    }, []);

	const showCompanyHeader = useCallback(() => {
		return match({ isLoading, error, company })
			.with({ isLoading: true, error: P.nullish }, () => (
				<div className="grid flex-1 text-left text-sm leading-tight">
					<Skeleton className="truncate font-medium rounded-full w-full h-[14px]" />
					<Skeleton className="truncate font-medium rounded-full w-full h-[14px]" />
				</div>
			))
			.with({ isLoading: false, error: P.nullish, company: P.nonNullable }, ({ company }) => (
				<div className="grid flex-1 text-left text-sm leading-tight transition-all">
					<span className="truncate font-medium">{company.title}</span>
					<span className="truncate text-xs {/*group-hover/company:animate-spin*/} transition-all">Access to editor</span>
				</div>
			))
			.otherwise(() => (
				<div className="grid flex-1 text-left text-sm leading-tight">
					<span className="truncate font-medium">{"ACME"}</span>
					<span className="truncate text-xs">{"Enterprise"}</span>
				</div>
			));
	}, [company, isLoading, error]);

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild size="lg" className={"group/company"} onClick={onClickEditor}>
							<a href="#">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Command className="size-4" />
								</div>
								{showCompanyHeader()}
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
                <NavMain items={adminItems} />
				<NavSecondary ctx={{roles, user}} className="mt-auto" items={navSecondary} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser {...user} />
			</SidebarFooter>
		</Sidebar>
	);
}
