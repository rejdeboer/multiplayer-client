'use client'

import { useState } from "react"
import { Button, Dialog } from "../ui"
import { AddContributorMenu, AddContributorProvider } from "./add-contributor-menu";

export type AddContributorProps = {
	documentId: string,
}

export function AddContributor({
	documentId,
}: AddContributorProps) {
	const [showDialog, setShowDialog] = useState<boolean>(false);

	return (<>
		<Button onClick={() => setShowDialog(true)}>Share</Button>
		<Dialog
			title="Add contributors"
			isOpen={showDialog}
			setIsOpen={setShowDialog}
			className="space-x-8"
		>
			<AddContributorProvider afterSubmit={() => setShowDialog(false)} documentId={documentId}>
				<AddContributorMenu />
			</AddContributorProvider>
		</Dialog>
	</>)
}
