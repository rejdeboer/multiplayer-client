'use client'

import type { UserListItem } from "@/lib/server-client"
import { type ReactNode, createContext, useState, useCallback, useContext } from "react"

type AddContributorProviderProps = {
	children: ReactNode,
}

export type AddContributorContext = {
	selectedUsers: UserListItem[],
	addUser: (user: UserListItem) => void,
	removeUser: (id: string) => void,
}

const Context = createContext<AddContributorContext>({
	selectedUsers: [],
	addUser: () => { },
	removeUser: () => { }
})

export function AddContributorProvider({
	children,
}: AddContributorProviderProps) {
	const [selectedUsers, setSelectedUsers] = useState<UserListItem[]>([])

	const addUser = useCallback((user: UserListItem) => {
		setSelectedUsers([...selectedUsers, user])
	}, [])

	const removeUser = useCallback((id: string) => {
		setSelectedUsers(selectedUsers.filter(user => user.id !== id))
	}, [])

	const value: AddContributorContext = {
		selectedUsers,
		addUser,
		removeUser,
	}

	return (
		<Context.Provider value={value}>
			{children}
		</Context.Provider>
	)
}

export const useAddContributor = () => useContext(Context)
