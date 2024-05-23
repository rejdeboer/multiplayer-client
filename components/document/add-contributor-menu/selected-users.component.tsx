'use client'

import { useAddContributor } from "./add-contributor.context"

export function SelectedUsers() {
	const { selectedUsers } = useAddContributor()

	return (
		<div className="space-x-2">
			{selectedUsers.map(user => (
				<span key={user.id} className="p-2 border-1 bg-gray-800">
					{user.username}
				</span>
			))}
		</div>
	)
}
