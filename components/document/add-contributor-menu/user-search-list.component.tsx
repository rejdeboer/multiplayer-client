'use client'

import { useResults } from "@/components/search";
import type { UserListItem } from "@/lib/server-client";
import { useAddContributor } from "./add-contributor.context";

export function UserSearchList() {
	const searchResults = useResults<UserListItem>();
	const { selectedUsers, addUser } = useAddContributor()

	return (
		<div>
			{searchResults
				.filter(user => !selectedUsers.some(selectedUser => selectedUser.id === user.id))
				.map(user => (
					<div
						onMouseDown={() => addUser(user)}
						key={user.id}
						className="border-y-1 py-2 px-4"
					>
						{user.username}
					</div>
				))
			}
		</div >
	)
}
