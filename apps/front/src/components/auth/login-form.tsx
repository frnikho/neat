'use client';

import {Button, Input, useAppForm} from "@neat/ui";
import {GalleryVerticalEnd} from "lucide-react";
import React, {FormEvent, useCallback} from "react";

import {validate, validateField} from "@/lib/validation";
import {loginSchema} from "@neat/types";
import {useLoading} from "@/hooks/loading";

import { toast } from "sonner"
import { useRouter } from "next/navigation";

type Props = {
    redirect?: string;
}

export default function LoginForm({redirect}: Props) {

    const {loading, execute} = useLoading();
    const router = useRouter();

    const form = useAppForm({
        defaultValues: {
            email: '',
            password: ''
        },
        validators: {
            onSubmit: ({value}) => validate(loginSchema, value),
        },
        onSubmit: async ({value}) => (
            execute(_login(value), (res) => {
                if (res.error) {
                    return toast('Une erreur est survenue', {description: res.error});
                }
                toast('Connexion réussie', {description: res.message});
                router.push(redirect ?? '/admin');
            }, (err) => {
                console.log(err);
            })
        )
    });

    const _login = async (value: typeof form.state.values) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(value),
            credentials: 'include'
        });
        return await res.json();
    }

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return form.handleSubmit();
    }, [form]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <a href="#" className="flex flex-col items-center gap-2 font-medium">
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <form.AppField validators={{onBlur: () => validateField(loginSchema, form.state.values, 'email')}} name={"email"} children={(field) => (
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
                    <form.AppField validators={{onBlur: () => validateField(loginSchema, form.state.values, 'password')}} name={"password"} children={(field) => (
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
                    <Button loading={loading} type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </div>
        </div>
    )
}