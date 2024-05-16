import { Editor } from "@/components/document"

type DocumentParams = {
  id: string
}

export default function Document({
  params,
}: { params: DocumentParams }) {
  return <Editor documentId={params.id} />
}
