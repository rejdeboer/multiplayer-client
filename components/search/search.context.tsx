'use client'

import type { UserListItem } from "@/lib/server-client"
import { createContext } from "react"

type ResourceType = "users"

export type SearchProviderProps = {
	type: ResourceType
	children: React.ReactNode
}

export type SearchContext = {
	query: (query: string) => UserListItem[]
}

const Context = createContext()

export function SearchProvider({
	type,
	children,
}: SearchProviderProps) {

	const value: SearchContext = {

	}
	return (
		<Context.Provider value={}>
			{children}
		</Context.Provider>
	)
}
