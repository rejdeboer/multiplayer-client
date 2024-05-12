import { getAccessToken } from "./get-access-token"
import { Server } from "../../server-client"
import { PUBLIC_CONFIG } from "../../config"

export function getServerSession() {
	const token = getAccessToken()

	if (token === undefined) {
		throw new Error("This is only usable if authenticated")
	}

	return Server(PUBLIC_CONFIG.SERVER_ENDPOINT, token)
}
