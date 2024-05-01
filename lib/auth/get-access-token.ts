import { cookies } from "next/headers"
import { TOKEN_KEY } from "./token-key.constant"

export function getAccessToken(): string | undefined {
	// If we call this from the browser
	if (window != undefined) {
		// TODO: Do we need the access token on the client?
	}

	const store = cookies()
	return store.get(TOKEN_KEY)?.value
}

