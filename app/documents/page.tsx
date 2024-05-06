import { DocumentList } from "@/components/document/document-list.component";
import { getServerSessionOrRedirect } from "@/lib/auth/get-token-or-redirect";

export async function Documents() {
  const server = getServerSessionOrRedirect();
  const documents = await server.documents.list();

  return (
    <DocumentList documents={documents} />
  )
}
