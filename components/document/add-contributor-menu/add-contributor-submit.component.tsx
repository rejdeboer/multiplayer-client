'use client'

import { Button } from "@/components/ui";
import { useAddContributor } from "./add-contributor.context"

export function AddContributorSubmit() {
	const { submit } = useAddContributor();

	return (
		<Button onClick={submit}>
			Submit
		</Button>
	)
}
