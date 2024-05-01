import { requireEnvironmentVariable } from "./require-environment-variable"

export const PUBLIC_CONFIG = {
	get SERVER_ENDPOINT(): string {
		return requireEnvironmentVariable("SERVER_ENDPOINT")
	},

	get WEBSOCKET_ENDPOINT(): string {
		return requireEnvironmentVariable("WEBSOCKET_ENDPOINT")
	},
}
