import {ReactNode} from 'react';
import '@styles/backoffice.css';
import {redirect} from "next/navigation";
import {cookies, headers} from "next/headers";
import Provider from "@/app/admin/provider";
import SidebarApp from "@/components/backoffice/sidebar/sidebar";
import {getAuthUser} from "@/hooks/server/auth";

export default async function Layout({children}: Readonly<{ children: ReactNode }>) {

    const headersList = await headers();
    const clientCookies = await cookies();

    const path = headersList.get('x-current-path') ?? '/';

    const access_token = clientCookies.get('access_token');
    const refresh_token = clientCookies.get('refresh_token');

    if (!access_token || !refresh_token) {
        return redirect(`/auth/login?redirect=${path}`);
    }

    const user = await getAuthUser(access_token.value);

    if (!user) {
        return redirect(`/auth/login?redirect=${path}`);
    }

    return (
        <html lang={"en"} suppressHydrationWarning>
        <body>
        <Provider user={user}>
            <SidebarApp/>
            <main className={"p-4"}>{children}</main>
        </Provider>
        </body>
        </html>
    );
}