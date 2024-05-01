const TOKEN_KEY = "access-token";

export type AccessToken = {
  jwt: string,
}

export function getLocalToken(): AccessToken | undefined {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token == null) {
    return undefined;
  }

  return {
    jwt: token,
  }
}

export function storeToken(token: AccessToken) {
  localStorage.setItem(TOKEN_KEY, token.jwt);
}
