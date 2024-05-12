import { cookies } from "next/headers"
import { TOKEN_KEY } from "../token-key.constant"

export function getAccessToken(): string | undefined {
	const store = cookies()
	return store.get(TOKEN_KEY)?.value
}

