import {NavMain} from '@app/components/nav-main';
import {NavProjects} from '@app/components/nav-projects';
import {NavSecondary} from '@app/components/nav-secondary';
import {NavUser} from '@app/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@app/components/ui/sidebar';
import {
    BookOpen,
    Bot,
    Command,
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
} from 'lucide-react';
import type * as React from 'react';
import {useAuth} from "@app/hooks/use-auth";
import {useServerFn} from "@tanstack/react-start";
import {getCompanySettings} from "@app/server/settings.server";
import {useQuery} from "@tanstack/react-query";
import {useCallback} from "react";
import {match, P} from "ts-pattern";
import {Skeleton} from "@app/components/ui/skeleton";

const data = {
    navMain: [
        {
            title: 'Playground',
            url: '#',
            icon: SquareTerminal,
            items: [
                {
                    title: 'History',
                    url: '#',
                },
                {
                    title: 'Starred',
                    url: '#',
                },
                {
                    title: 'Settings',
                    url: '#',
                },
            ],
        },
        {
            title: 'Models',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Genesis',
                    url: '#',
                },
                {
                    title: 'Explorer',
                    url: '#',
                },
                {
                    title: 'Quantum',
                    url: '#',
                },
            ],
        },
        {
            title: 'Documentation',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Introduction',
                    url: '#',
                },
                {
                    title: 'Get Started',
                    url: '#',
                },
                {
                    title: 'Tutorials',
                    url: '#',
                },
                {
                    title: 'Changelog',
                    url: '#',
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            items: [
                {
                    title: 'General',
                    url: '#',
                },
                {
                    title: 'Team',
                    url: '#',
                },
                {
                    title: 'Billing',
                    url: '#',
                },
                {
                    title: 'Limits',
                    url: '#',
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: 'Support',
            url: '#',
            icon: LifeBuoy,
        },
        {
            title: 'Feedback',
            url: '#',
            icon: Send,
        },
    ],
    projects: [
        {
            name: 'Design Engineering',
            url: '#',
            icon: Frame,
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: PieChart,
        },
        {
            name: 'Travel',
            url: '#',
            icon: Map,
        },
    ],
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {

    const {user} = useAuth();

    const getSettingsFn = useServerFn(getCompanySettings);

    const {data: company, isLoading, error} = useQuery({
        queryKey: ['company_settings'],
        queryFn: () => getSettingsFn(),
    });

    const showCompanyHeader = useCallback(() => {
        return match({isLoading, error, company})
            .with({isLoading: true, error: P.nullish}, ({company}) => (
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <Skeleton className="truncate font-medium rounded-full w-full h-[14px]" />
                    <Skeleton className="truncate font-medium rounded-full w-full h-[14px]" />
                </div>
            ))
            .with(({isLoading: false, error: P.nullish, company: P.nonNullable}), ({company}) => (
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{company.title}</span>
                    <span className="truncate text-xs">{company.slogan}</span>
                </div>
            ))
            .otherwise(() => (
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{'ACME'}</span>
                    <span className="truncate text-xs">{'Enterprise'}</span>
                </div>
            ))
    }, [company, isLoading, error]);

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg">
                            <a href="#">
                                <div
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4"/>
                                </div>
                                {showCompanyHeader()}
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                <NavProjects projects={data.projects}/>
                <NavSecondary className="mt-auto" items={data.navSecondary}/>
            </SidebarContent>data
            <SidebarFooter>
                <NavUser {...user}/>
            </SidebarFooter>
        </Sidebar>
    );
}
