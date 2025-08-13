import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card";
import { Input } from "@app/components/ui/input";
import { Label } from "@app/components/ui/label";
import { useAppForm } from "@app/components/ui/tanstack-form";
import { apiClient } from "@app/lib/client";
import { typeBoxValidator } from "@app/lib/validation";
import { type AuthRegisterRequest, authRegisterRequest } from "@neat/types/auth";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { useRouter } from "@tanstack/react-router";
import { type FormEvent, useCallback } from "react";
import { toast } from "sonner";
import { match, P } from "ts-pattern";

const authCompiler = TypeCompiler.Compile(authRegisterRequest);

type Props = {
	token: string;
};

export default function Register({ token }: Props) {
	const router = useRouter();

	const form = useAppForm({
		validators: {
			onSubmit: ({ value }) => typeBoxValidator(authCompiler, value),
		},
		asyncDebounceMs: 500,
		defaultValues: {
			email: "",
			password: "",
			firstname: "",
			lastname: "",
			token,
		},
		onSubmit: ({ value }) => register(value),
	});

	const register = async (value: AuthRegisterRequest) => {
		apiClient.auth.register
			.post(value)
			.then(({ data, error }) => {
				match({ data, error })
					.with({ error: { status: P.nonNullable.and(422) } }, ({ error }) => {
						console.log("422", error);
					})
					.with({ error: { status: P.nonNullable.and(400) } }, ({ error }) => {
						console.log("400", error);
					})
					.with({ error: { status: P.nonNullable.and(500) } }, ({ error }) => {
						console.log("500", error);
					})
					.with({ error: P.nonNullable }, ({ error }) => {})
					.with({ data: P.nonNullable, error: P.nullish }, ({ data }) => {
						form.reset();
						toast.success("Registration successful!", {
							duration: 3000,
							onDismiss: () => router.navigate({ to: "/dashboard" }),
							onAutoClose: () => router.navigate({ to: "/dashboard" }),
						});
					})
					.otherwise(() => {});
			})
			.catch((err) => {
				console.log(err);
				console.log("Registration failed");
			});
		//await new Promise(r => setTimeout(r, 2000));
	};

	const handleSubmit = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			e.stopPropagation();
			void form.handleSubmit();
		},
		[form],
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Register</CardTitle>
				<CardDescription>
					Please fill in the form below to create your account. Use the token provided to you for registration.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form.AppForm>
					<form className={"flex flex-col gap-4"} onSubmit={handleSubmit}>
						<div className={"grid gap-2"}>
							<Label children={"Token"} />
							<Input disabled value={token} />
						</div>
						<div className={"grid grid-cols-2 items-start gap-4"}>
							<form.AppField
								children={(f) => (
									<f.FormItem>
										<f.FormLabel>Nom</f.FormLabel>
										<f.FormControl>
											<Input
												autoComplete={"family-name"}
												onBlur={f.handleBlur}
												onChange={(e) => f.handleChange(e.target.value)}
												placeholder="Doe"
												type={"text"}
												value={f.state.value}
											/>
										</f.FormControl>
										<f.FormMessage />
									</f.FormItem>
								)}
								name="lastname"
							/>
							<form.AppField
								children={(f) => (
									<f.FormItem>
										<f.FormLabel>Prénom</f.FormLabel>
										<f.FormControl>
											<Input
												autoComplete={"name"}
												onBlur={f.handleBlur}
												onChange={(e) => f.handleChange(e.target.value)}
												placeholder="John"
												type={"text"}
												value={f.state.value}
											/>
										</f.FormControl>
										<f.FormMessage />
									</f.FormItem>
								)}
								name="firstname"
							/>
						</div>
						<form.AppField
							children={(f) => (
								<f.FormItem>
									<f.FormLabel>Email</f.FormLabel>
									<f.FormControl>
										<Input
											autoComplete={"email"}
											onBlur={f.handleBlur}
											onChange={(e) => f.handleChange(e.target.value)}
											placeholder="hello@gmail.com"
											type={"email"}
											value={f.state.value}
										/>
									</f.FormControl>
									<f.FormDescription>This is your public display name.</f.FormDescription>
									<f.FormMessage />
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
											autoComplete={"current-password"}
											onBlur={f.handleBlur}
											onChange={(e) => f.handleChange(e.target.value)}
											placeholder="******"
											type={"password"}
											value={f.state.value}
										/>
									</f.FormControl>
									<f.FormMessage />
								</f.FormItem>
							)}
							name="password"
						/>
						<form.Subscribe
							children={({ canSubmit, isSubmitting }) => (
								<Button disabled={!canSubmit} loading={isSubmitting} type={"submit"}>
									Register
								</Button>
							)}
						/>
					</form>
				</form.AppForm>
			</CardContent>
		</Card>
	);
}
