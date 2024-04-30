export function requireEnvironmentVariable(
	property: string,
): string {
	const value = process.env[property];

	if (value === undefined) {
		throw new Error(`Environment variable ${property} is undefined`);
	}

	return value;
}
