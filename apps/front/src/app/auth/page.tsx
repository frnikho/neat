'use client';

import React, {FormEvent, useCallback} from "react";
import {GalleryVerticalEnd} from "lucide-react"
import {Button, cn, Input, useAppForm} from "@neat/ui";
import {client} from "@lib/client";
import {loginSchema} from "@neat/types";
import {validate} from "@lib/validation";

export default function Page() {
    return (
        <div>
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm/>
                </div>
            </div>
        </div>
    )
}

export function LoginForm({className, ...props}: React.ComponentPropsWithoutRef<"div">) {

    const form = useAppForm({
        defaultValues: {
            email: '',
            password: ''
        },
        validators: {
            onSubmit: ({value}) => validate(loginSchema(), value),
        },
        onSubmit: async ({value}) => {
            const result = await client.auth.login.post(value);
            console.log(result);
        }
    });

    const onClickLogin = async () => {
        const {data} = await client.auth.login.post({email: '', password: ''});
        console.log(data);
    }

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return form.handleSubmit();
    }, [form]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <a
                            href="#"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6"/>
                            </div>
                            <span className="sr-only">Acme Inc.</span>
                        </a>
                        <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="#" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <form.AppField name={"email"} children={(field) => (
                            <field.FormItem>
                                <field.FormLabel>Email</field.FormLabel>
                                <field.FormControl>
                                    <Input name={field.name}
                                           type={'email'}
                                           value={field.state.value}
                                           onBlur={field.handleBlur}
                                           onChange={(e) => field.handleChange(e.currentTarget.value)}/>
                                </field.FormControl>
                                <field.FormMessage/>
                            </field.FormItem>
                        )}/>
                        <form.AppField name={"password"} children={(field) => (
                            <field.FormItem>
                                <field.FormLabel>Mot de passe</field.FormLabel>
                                <field.FormControl>
                                    <Input name={field.name}
                                           type={'password'}
                                           value={field.state.value}
                                           onBlur={field.handleBlur}
                                           onChange={(e) => field.handleChange(e.currentTarget.value)}/>
                                </field.FormControl>
                                <field.FormMessage/>
                            </field.FormItem>
                        )}/>
                        <Button loading type="submit" className="w-full">
                            Login
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
