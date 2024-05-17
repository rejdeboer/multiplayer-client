import { getServerSession } from "@/lib/auth/browser/get-server-session"
import type { Document } from "@/lib/server-client";
import useSWR, { type KeyedMutator } from "swr"

export type UseDocumentList = {
  documents?: Document[],
  mutate: KeyedMutator<Document[]>,
}

export function useDocumentList() {
  const server = getServerSession();
  const {
    data: documents,
    mutate,
  } = useSWR("documents", () => server.documents.list())

  return {
    documents,
    mutate,
  }
}
