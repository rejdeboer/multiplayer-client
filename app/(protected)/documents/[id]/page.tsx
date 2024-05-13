import { Editor } from "@/components/document"
import { getAccessToken } from "@/lib/auth/server/get-access-token"
import { PUBLIC_CONFIG } from "@/lib/config"

type DocumentParams = {
  id: string
}

export default async function Document({
  params,
}: { params: DocumentParams }) {
  const token = getAccessToken()
  const url = `${PUBLIC_CONFIG.WEBSOCKET_ENDPOINT}/sync/${params.id}?token=${token}`
  const websocket = new WebSocket(url)

  return <Editor />
}
