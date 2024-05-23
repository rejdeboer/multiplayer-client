'use client'

import { getServerSession } from "@/lib/auth/browser/get-server-session"
import type { Document, UserListItem } from "@/lib/server-client"
import { SearchParams } from "@/lib/server-client/resource"
import { createContext, useCallback, useContext, useState } from "react"

type ResourceType = "users" | "documents"
type ReturnType = UserListItem | Document

export type SearchProviderProps = {
	type: ResourceType
	children: React.ReactNode
}

export type SearchContext = {
	query: (params: SearchParams) => void,
	results: ReturnType[],
}

const Context = createContext<SearchContext>({
	query: () => { },
	results: []
})

export function SearchProvider({
	type,
	children,
}: SearchProviderProps) {
	const [results, setResults] = useState<ReturnType[]>([])
	const server = getServerSession();

	const query = useCallback((params: SearchParams) => {
		server[type].search(params)
			.then(setResults)
	}, [])

	const value: SearchContext = {
		query,
		results,
	}

	return (
		<Context.Provider value={value}>
			{children}
		</Context.Provider>
	)
}

export function useResults<T extends ReturnType>(): T[] {
	const { results } = useContext(Context)
	return results as T[];
}

export function useQuery(): (params: SearchParams) => void {
	const { query } = useContext(Context)
	return query
}
