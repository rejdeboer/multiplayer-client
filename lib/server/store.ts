const TOKEN_KEY = "access-token";

export type AccessToken = {
  token: string,
}

export function getLocalToken(): AccessToken | undefined {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token == null) {
    return undefined;
  }

  return {
    token,
  }
}

export function storeToken(token: AccessToken) {
  localStorage.setItem(TOKEN_KEY, token.token);
}
