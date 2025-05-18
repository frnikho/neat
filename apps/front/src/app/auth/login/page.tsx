import LoginForm from "@/components/auth/login-form";
import React from "react";
import {cookies} from "next/headers";
import {getAuthUser} from "@/hooks/server/auth";
import {redirect} from "next/navigation";

type Params = {
    redirect?: string;
}

type Props = {
    searchParams: Promise<Params>;
}

export default async function Page({searchParams}: Props) {

    const params = await searchParams;
    const clientCookies = await cookies();
    const access_token = clientCookies.get('access_token');

    if (access_token) {
        const user = await getAuthUser(access_token.value);
        if (user) {
            return redirect(params.redirect ?? '/admin')
        }
    }

    return (
        <div>
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm redirect={params.redirect ?? '/admin'}/>
                </div>
            </div>
        </div>
    )
}