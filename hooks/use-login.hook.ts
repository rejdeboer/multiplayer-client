import { setAccessToken } from "@/lib/auth/browser/set-access-token";
import { PUBLIC_CONFIG } from "@/lib/config";
import { Server } from "@/lib/server-client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useLogin(): (email: string, password: string) => Promise<void> {
  const { push } = useRouter();
  const serverClient = Server(PUBLIC_CONFIG.SERVER_ENDPOINT)

  const login = useCallback(async (email: string, password: string) => {
    const token = await serverClient.authenticate(email, password)
    setAccessToken(token.token, token.expiresInSeconds)
    push("/documents")
  }, [])

  return login
}
