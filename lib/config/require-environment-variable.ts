type EnvironmentVariable = |
	"SERVER_ENDPOINT" |
	"WEBSOCKET_ENDPOINT"

export function requireEnvironmentVariable(
	key: EnvironmentVariable,
): string {
	const value = getValue(key)

	if (value === undefined) {
		throw new Error(`Environment variable ${key} is undefined`);
	}

	return value;
}

function getValue(key: EnvironmentVariable): string | undefined {
	switch (key) {
		case "SERVER_ENDPOINT": return process.env.NEXT_PUBLIC_SERVER_ENDPOINT
		case "WEBSOCKET_ENDPOINT": return process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT
	}
}
