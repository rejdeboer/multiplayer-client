import { redirect } from "next/navigation"
import { getAccessToken } from "./get-access-token"
import { Server } from "../server-client"
import { PUBLIC_CONFIG } from "../config"

export function getServerSessionOrRedirect() {
	const token = getAccessToken()

	if (token === undefined) {
		redirect("/login")
	}

	return Server(PUBLIC_CONFIG.SERVER_ENDPOINT, token)
}
