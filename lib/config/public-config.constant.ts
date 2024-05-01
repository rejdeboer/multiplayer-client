import { requireEnvironmentVariable } from "./require-environment-variable"

export const PUBLIC_CONFIG = {
	get SERVER_ENDPOINT(): string {
		return requireEnvironmentVariable("NEXT_PUBLIC_SERVER_ENDPOINT")
	},

	get WEBSOCKET_ENDPOINT(): string {
		return requireEnvironmentVariable("NEXT_PUBLIC_WEBSOCKET_ENDPOINT")
	},
}
