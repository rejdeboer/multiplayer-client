'use client'

import { Editor as MonacoEditor } from "@monaco-editor/react"
import { useRef } from "react"
import { editor } from "monaco-editor"
import { MonacoBinding, WebsocketProvider } from "@/lib/sync"
import { PUBLIC_CONFIG } from "@/lib/config"
import * as Y from "yjs"
import { getAccessToken } from "@/lib/auth/browser/get-access-token"

export type EditorProps = {
	documentId: string
}

export function Editor({
	documentId
}: EditorProps) {
	const editorRef = useRef<editor.IStandaloneCodeEditor>();

	function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
		editorRef.current = editor;

		const doc = new Y.Doc();

		const provider = new WebsocketProvider(PUBLIC_CONFIG.WEBSOCKET_ENDPOINT, documentId, doc, {
			params: {
				token: getAccessToken()!
			}
		});
		const type = doc.getText(documentId);

		// Bind yjs doc to Monaco editor
		const _binding = new MonacoBinding(
			type,
			editorRef.current!.getModel()!,
			new Set([editorRef.current!]),
			provider.awareness
		);
	}

	return (
		<MonacoEditor
			theme="vs-dark"
			language="markdown"
			height="100vh"
			onMount={handleEditorDidMount}
		/>
	)
}
