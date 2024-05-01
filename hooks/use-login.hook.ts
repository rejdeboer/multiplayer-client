import { PUBLIC_CONFIG, Server, setAccessToken } from "@/lib";
import { useCallback } from "react";

export function useLogin(): (email: string, password: string) => Promise<void> {
  const serverClient = Server(PUBLIC_CONFIG.SERVER_ENDPOINT)

  const login = useCallback(async (email: string, password: string) => {
    return serverClient.authenticate(email, password)
      // TODO: Use `expiresIn` value from server
      .then(token => setAccessToken(token.jwt, 3600))
  }, [])

  return login
}
