import { Avatar, AvatarFallback, AvatarImage } from "@app/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@app/components/ui/sidebar";
import {BadgeCheck, ChevronsUpDown, LogOut, Paintbrush, Paintbrush2, User} from "lucide-react";
import {apiClient} from "@app/lib/client";
import {useCallback} from "react";
import {match, P} from "ts-pattern";
import {toast} from "sonner";
import {useNavigate} from "@tanstack/react-router";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useTheme} from "@app/components/providers/theme.provider";

type Props = {
    firstname: string;
    lastname: string;
    email: string;
    profilePicture?: string | undefined;
}

export function NavUser({firstname, lastname, email, profilePicture}: Props) {
	const { isMobile } = useSidebar();
    const navigate = useNavigate();
    const { setTheme, theme } = useTheme()

    const logout = () => {
        return apiClient.auth.session.current.delete().then(({data, error}) => {
            match({data, error})
                .with({error: P.nonNullable}, () => {
                    console.error("Failed to log out:", error);
                    toast.error('Une erreur est survenue lors de la déconnexion.');
                })
                .with({data: P._}, () => {
                    throw navigate({to: '/auth/login'});
                });
        })
    }

    const onClickAccount = () => {
        return navigate({to: '/dashboard/account'})
    }

    const onClickTheme = () => {
        match(theme)
            .with('light', () => setTheme('dark'))
            .with('dark', () => setTheme('light'))
            .otherwise(() => setTheme('light'));
    }

    const {mutate: callLogout, isPending: logoutPending} = useMutation({
        mutationFn: logout
    });

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" size="lg">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage alt={email} src={profilePicture} />
								<AvatarFallback className="rounded-lg">
									{firstname.at(0)}
									{lastname.at(0)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{firstname} {lastname}
								</span>
								<span className="truncate text-xs">{email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage alt={email} src={profilePicture} />
									<AvatarFallback className="rounded-lg">
										{firstname.at(0)}
										{lastname.at(0)}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{firstname}</span>
									<span className="truncate text-xs">{lastname}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem className={'cursor-pointer'} onClick={onClickAccount}>
								<User />
								Mon compte
							</DropdownMenuItem>
                            <DropdownMenuItem className={'cursor-pointer'} onClick={(e) => {
                                e.preventDefault();
                                onClickTheme();
                            }}>
                                <Paintbrush2 />
                                Thème
                            </DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem className={'cursor-pointer'} onClick={() => callLogout()}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
