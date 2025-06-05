import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    SidebarFooter,
    SidebarMenuButton,
} from "@neat/ui";
import {useUser} from "@/contexts/user";
import ThemeToggle from "../theme-toggle";

export default function SidebarFooterApp() {

    const user = useUser();

    return (
        <SidebarFooter>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size={'lg'}>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.firstname}</span>
                            <span className="truncate text-xs text-muted-foreground">
                              {user.email}
                            </span>
                        </div>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side={'right'}>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                    <DropdownMenuItem>
                        <ThemeToggle/>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
    )
}