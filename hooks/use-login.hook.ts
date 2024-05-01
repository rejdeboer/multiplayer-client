import { setAccessToken } from "@/lib/auth/set-access-token";
import { PUBLIC_CONFIG } from "@/lib/config";
import { Server } from "@/lib/server-client";
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
