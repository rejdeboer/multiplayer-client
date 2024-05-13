import { PUBLIC_CONFIG } from "@/lib/config";
import { Server } from "@/lib/server-client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useSignup(): (
  email: string,
  username: string,
  password: string
) => Promise<void> {
  const { push } = useRouter();
  const serverClient = Server(PUBLIC_CONFIG.SERVER_ENDPOINT)

  const signup = useCallback(async (
    email: string,
    username: string,
    password: string
  ) => {
    await serverClient.users.create({
      email,
      username,
      password,
    })
    push("/login")
  }, [])

  return signup
}
