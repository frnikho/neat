import {Button} from '@app/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@app/components/ui/card';
import {Input} from '@app/components/ui/input';
import {useAppForm} from '@app/components/ui/tanstack-form';
import {apiClient} from '@app/lib/client';
import {typeBoxValidator} from '@app/lib/validation';
import {type AuthLoginRequest, authLoginRequest} from '@neat/types/auth';
import {TypeCompiler} from '@sinclair/typebox/compiler';
import {type FormEvent, useCallback} from 'react';

import {toast} from 'sonner';
import {match, P} from 'ts-pattern';
import {useNavigate} from "@tanstack/react-router";

const authCompiler = TypeCompiler.Compile(authLoginRequest);

type Props = {
    redirect?: string;
};

export default function Login(props: Props) {

    const router = useNavigate();

    const form = useAppForm({
        validators: {
            onSubmit: ({value}) => typeBoxValidator(authCompiler, value),
        },
        asyncDebounceMs: 500,
        defaultValues: {
            email: '',
            password: '',
        },
        onSubmit: ({value}) => login(value),
    });

    const login = (value: AuthLoginRequest) => {
        apiClient.auth.login
            .post(value)
            .then(({data, error}) => {
                match({data, error}).with({data: P.nonNullable}, () => {
                    return router({to: props.redirect ?? '/dashboard'});
                }).otherwise(() => {
                    toast.error('Auth', {description: 'Invalid email or password'});
                })
            })
            .catch((err) => {
                toast('Auth', {
                    description: 'Une erreur est survenue lors de la connexion',
                });
            });
    };

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
        },
        [form]
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form.AppForm>
                    <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
                        <form.AppField
                            children={(f) => (
                                <f.FormItem>
                                    <f.FormLabel>Email</f.FormLabel>
                                    <f.FormControl>
                                        <Input
                                            autoComplete={'email'}
                                            onBlur={f.handleBlur}
                                            onChange={(e) => f.handleChange(e.target.value)}
                                            placeholder="hello@gmail.com"
                                            type={'email'}
                                            value={f.state.value}
                                        />
                                    </f.FormControl>
                                    <f.FormDescription>
                                        This is your public display name.
                                    </f.FormDescription>
                                    <f.FormMessage/>
                                </f.FormItem>
                            )}
                            name="email"
                        />
                        <form.AppField
                            children={(f) => (
                                <f.FormItem>
                                    <f.FormLabel>Password</f.FormLabel>
                                    <f.FormControl>
                                        <Input
                                            autoComplete={'current-password'}
                                            onBlur={f.handleBlur}
                                            onChange={(e) => f.handleChange(e.target.value)}
                                            placeholder="******"
                                            type={'password'}
                                            value={f.state.value}
                                        />
                                    </f.FormControl>
                                    <f.FormMessage/>
                                </f.FormItem>
                            )}
                            name="password"
                        />
                        <Button type={'submit'}>Submit</Button>
                    </form>
                </form.AppForm>
            </CardContent>
        </Card>
    );
}
