'use client'

import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { Button, Input } from "../ui"
import { useRouter } from "next/navigation"
import { getServerSession } from "@/lib/auth/browser/get-server-session"

type Inputs = {
	name: string
}

export function CreateDocumentForm() {
	const {
		register,
		handleSubmit,
	} = useForm<Inputs>()
	const { push } = useRouter();

	const server = getServerSession();

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		const document = await server.documents.create({ name: data.name })
		push(`documents/${document.id}`)
	}

	return (
		<form className="flex flex-col space-y-6" onSubmit={handleSubmit(onSubmit)} method="POST" >
			<Input
				type="text"
				{...register("name", { required: true })}
			/>
			<Button type="submit">
				Submit
			</Button>
		</form>
	)
}

