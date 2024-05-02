'use client'

import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Input } from "../ui";
import { useLogin } from "@/hooks";
import Link from "next/link";
import type { ServerError } from "@/lib/server-client";

type Inputs = {
	email: string,
	password: string,
}

export function LoginForm() {
	const login = useLogin()
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<Inputs>()
	const onSubmit: SubmitHandler<Inputs> = (data) => {
		login(data.email, data.password)
			.catch((e: ServerError) => setError("root", {
				message: e.message,
			}))
	}

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
						required
						className="block w-full"
						{...register("email", { required: true })}
					/>
				</div>
				{errors.email && <div className="mt-2 text-red-500">{errors.email.message}</div>}
			</div>

			<div>
				<div className="flex items-center justify-between">
					<label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
						Password
					</label>
					<div className="text-sm">
						<Link href="/forgot-password" className="font-semibold text-indigo-400 hover:text-indigo-300">
							Forgot password?
						</Link>
					</div>
				</div>
				<div className="mt-2">
					<Input
						id="password"
						type="password"
						autoComplete="current-password"
						required
						className="block w-full"
						{...register("password", { required: true })}
					/>
				</div>
				{errors.password && <div className="mt-2 text-red-500">{errors.password.message}</div>}
			</div>

			<div className="space-y-2">
				<Button
					type="submit"
					className="flex w-full justify-center "
				>
					Sign in
				</Button>
				{errors.root && <div className="text-red-500">{errors.root.message}</div>}
			</div>
		</form>
	)
}
