import { getAccessToken } from "@/lib/auth/browser/get-access-token"
import { PUBLIC_CONFIG } from "@/lib/config"
import { MonacoBinding, WebsocketProvider } from "@/lib/sync"
import { useMonaco } from "@monaco-editor/react"
import { useEffect, useState } from "react"
import * as Y from "yjs"

export type UseEditor = {
  binding: MonacoBinding | null,
}

export function useEditor(documentId: string): UseEditor {
  const [binding, setBinding] = useState<MonacoBinding | null>(null)
  const [type, setType] = useState<Y.Text | null>(null)
  const [provider, setProvider] = useState<WebsocketProvider | null>(null)

  useEffect(() => {
    const token = getAccessToken()
    const doc = new Y.Doc()
    const provider = new WebsocketProvider(PUBLIC_CONFIG.WEBSOCKET_ENDPOINT, documentId, doc, {
      params: {
        token: token!,
      }
    })
    setProvider(provider)
    setType(doc.getText(documentId))
  }, [])

  const monaco = useMonaco();

  useEffect(() => {
    if (type && monaco && provider && provider.synced) {
      const editor = monaco.editor.create(document.getElementById("monaco-editor")!, {
        value: '',
        language: "markdown",
        theme: "vs-dark",
      })
      setBinding(new MonacoBinding(type, editor.getModel()!, new Set([editor])/*, provider.awareness*/))
    }
  }, [monaco, type, provider])

  return {
    binding,
  }
}
