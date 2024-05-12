import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { Button, Input } from "../ui"
import type { Document, ServerClient } from "@/lib/server-client"
import type { KeyedMutator } from "swr"

type Inputs = {
	name: string
}

export type CreateDocumentFormProps = {
	server: ServerClient,
	mutate: KeyedMutator<Document[]>,
}

export function CreateDocumentForm({
	server,
	mutate,
}: CreateDocumentFormProps) {
	const {
		register,
		handleSubmit,
	} = useForm<Inputs>()

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await server.documents.create({ name: data.name })
		mutate()
	}

	return (
		<form className="space-y-6" onSubmit={handleSubmit(onSubmit)} method="POST" >
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

