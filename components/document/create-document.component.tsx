'use client'

import { useState } from "react"
import { Button, Dialog } from "../ui"
import { CreateDocumentForm } from "../forms"

export function CreateDocument() {
	const [isCreating, setIsCreating] = useState<boolean>(false);

	return (<>
		<Button onClick={() => setIsCreating(true)}>New document</Button>
		<Dialog title="Name your document" isOpen={isCreating} setIsOpen={setIsCreating}>
			<CreateDocumentForm />
		</Dialog>
	</>)
}
