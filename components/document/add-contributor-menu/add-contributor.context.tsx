'use client'

import { getServerSession } from "@/lib/auth/browser/get-server-session"
import type { UserListItem } from "@/lib/server-client"
import { type ReactNode, createContext, useState, useCallback, useContext } from "react"

type AddContributorProviderProps = {
	documentId: string,
	afterSubmit?: () => void,
	children: ReactNode,
}

export type AddContributorContext = {
	selectedUsers: UserListItem[],
	addUser: (user: UserListItem) => void,
	removeUser: (id: string) => void,
	submit: () => void,
}

const Context = createContext<AddContributorContext>({
	selectedUsers: [],
	addUser: () => { },
	removeUser: () => { },
	submit: () => { },
})

export function AddContributorProvider({
	documentId,
	afterSubmit,
	children,
}: AddContributorProviderProps) {
	const [selectedUsers, setSelectedUsers] = useState<UserListItem[]>([])

	const addUser = useCallback((user: UserListItem) => {
		setSelectedUsers([...selectedUsers, user])
	}, [selectedUsers])

	const removeUser = useCallback((id: string) => {
		setSelectedUsers(selectedUsers.filter(user => user.id !== id))
	}, [selectedUsers])

	const submit = useCallback(async () => {
		const server = getServerSession()

		// TODO: Create endpoint that adds all users at the same time
		await Promise.all(selectedUsers.map(user =>
			server.documents.addContributor(documentId, { userId: user.id })
		))
		setSelectedUsers([])

		if (afterSubmit !== undefined) {
			afterSubmit();
		}
	}, [selectedUsers, afterSubmit, documentId])

	const value: AddContributorContext = {
		selectedUsers,
		addUser,
		removeUser,
		submit,
	}

	return (
		<Context.Provider value={value}>
			{children}
		</Context.Provider>
	)
}

export const useAddContributor = () => useContext(Context)
