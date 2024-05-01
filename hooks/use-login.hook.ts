import { PUBLIC_CONFIG, Server } from "@/lib";

export function useLogin() {
  const serverClient = Server(PUBLIC_CONFIG.SERVER_ENDPOINT)
  return serverClient.authenticate
}
