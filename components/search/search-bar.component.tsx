'use client'

import { useState } from "react"
import { useQuery } from "./search.context"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "../ui"

export function SearchBar() {
	const sendQuery = useQuery()

	const handleChange = useDebouncedCallback((query: string) => {
		sendQuery({ query })
	}, 1000)

	return (
		<Input type="text" onChange={(e) => handleChange(e.target.value)} />
	)
}
