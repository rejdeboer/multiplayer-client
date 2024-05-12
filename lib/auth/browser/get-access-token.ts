import cookies from "js-cookie"
import { TOKEN_KEY } from "../token-key.constant"

export function getAccessToken(): string | undefined {
	return cookies.get(TOKEN_KEY)
}

