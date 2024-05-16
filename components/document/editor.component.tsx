'use client'

import { useEditor } from "@/hooks"

export type EditorProps = {
	documentId: string
}

export function Editor({
	documentId
}: EditorProps) {
	const { } = useEditor(documentId)

	return (<div className="h-dvh" id="monaco-editor"></div>)
}
