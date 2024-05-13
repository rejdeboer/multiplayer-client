'use client'

import { Editor as MonacoEditor } from "@monaco-editor/react"

export function Editor() {
	return (<MonacoEditor height="100vh" defaultLanguage="markdown" />)
}
