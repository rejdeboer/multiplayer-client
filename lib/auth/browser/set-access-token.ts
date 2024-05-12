import { TOKEN_KEY } from "../token-key.constant"

export function setAccessToken(token: string, expiresIn: number): void {
	// NOTE: Set grace period of 5 seconds for request latency
	let expires = new Date().getTime() + (expiresIn - 5) * 1000
	document.cookie = `${TOKEN_KEY}=${token};expires=${expires};path=/`
}
