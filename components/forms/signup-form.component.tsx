'use client'

import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Input } from "../ui";
import { useSignup } from "@/hooks";
import { useRef } from "react";
import type { ServerError } from "@/lib/server-client";

type Inputs = {
	email: string,
	username: string,
	password: string,
	passwordConfirm: string,
}

export function SignupForm() {
	const signup = useSignup()
	const {
		register,
		handleSubmit,
		setError,
		watch,
		formState: { errors },
	} = useForm<Inputs>()
	const onSubmit: SubmitHandler<Inputs> = (data) => {
		signup(data.email, data.username, data.password)
			.catch((e: ServerError) => {
				console.log(e);
				setError("root", {
					message: e.message,
				})
			})
	}

	const password = useRef({});
	password.current = watch("password", "");

	return (
		<form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit(onSubmit)} >
			<div>
				<label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
					Email address
				</label>
				<div className="mt-2">
					<Input
						id="email"
						type="email"
						autoComplete="email"
						className="block w-full"
						{...register("email", { required: true })}
					/>
				</div>
				{errors.email && <div className="mt-2 text-red-500">{errors.email.message}</div>}
			</div>

			<div>
				<label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
					Username
				</label>
				<div className="mt-2">
					<Input
						id="username"
						type="text"
						className="block w-full"
						{...register("username", {
							required: true, minLength: {
								value: 5,
								message: "Username must have at least 5 characters",
							},
						})}
					/>
				</div>
				{errors.username && <div className="mt-2 text-red-500">{errors.username.message}</div>}
			</div>

			<div>
				<label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
					Password
				</label>
				<div className="mt-2">
					<Input
						id="password"
						type="password"
						className="block w-full"
						{...register("password", {
							required: true, minLength: {
								value: 8,
								message: "Password must have at least 8 characters"
							},
							pattern: {
								value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].{9,}$/i,
								message: "Password must have a special character, at least 1 number and at least 1 letter"
							}
						})}
					/>
				</div>
				{errors.password && <div className="mt-2 text-red-500">{errors.password.message}</div>}
			</div>

			<div>
				<label htmlFor="password-confirm" className="block text-sm font-medium leading-6 text-white">
					Confirm password
				</label>
				<div className="mt-2">
					<Input
						id="password-confirm"
						type="password"
						className="block w-full"
						{...register("passwordConfirm", {
							validate: value =>
								value === password.current || "The passwords do not match"
						})}
					/>
				</div>
				{errors.passwordConfirm && <div className="mt-2 text-red-500">{errors.passwordConfirm.message}</div>}
			</div>

			<div className="space-y-2">
				<Button
					type="submit"
					className="flex w-full justify-center "
				>
					Sign up
				</Button>
				{errors.root && <div className="text-red-500">{errors.root.message}</div>}
			</div>
		</form>
	)
}
