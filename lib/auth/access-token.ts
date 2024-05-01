import { cookies } from "next/headers"

const TOKEN_KEY = "access-token";

export function getAccessToken(): string | undefined {
	// If we call this from the browser
	if (window != undefined) {
		// TODO: Do we need the access token on the client?
	}

	const store = cookies()
	return store.get(TOKEN_KEY)?.value
}

export function setAccessToken(token: string, expiresIn: number): void {
	const store = cookies()
	store.set(TOKEN_KEY, token, {
		// Set grace period of 5 seconds for request latency
		maxAge: expiresIn - 5,
		httpOnly: true,
	})
}
