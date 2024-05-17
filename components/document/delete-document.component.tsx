import { useCallback, useState } from "react"
import { Button, Dialog } from "../ui"
import { getServerSession } from "@/lib/auth/browser/get-server-session";
import type { KeyedMutator } from "swr";
import type { Document } from "@/lib/server-client";

export type DeleteDocumentProps = {
	documentId: string,
	mutate: KeyedMutator<Document[]>
}

export function DeleteDocument({
	documentId,
	mutate,
}: DeleteDocumentProps) {
	const [isDeleting, setIsDeleting] = useState<boolean>(false);

	const handleDelete = useCallback(async () => {
		const server = getServerSession()
		await server.documents.delete(documentId)
		mutate()
		setIsDeleting(false)
	}, [])

	return (<>
		<Button onClick={() => setIsDeleting(true)}>Delete</Button>
		<Dialog
			title="Are you sure?"
			isOpen={isDeleting}
			setIsOpen={setIsDeleting}
			className="space-x-8"
		>
			<Button onClick={() => setIsDeleting(false)}>Cancel</Button>
			<Button onClick={handleDelete}>Confirm</Button>
		</Dialog>
	</>)
}
