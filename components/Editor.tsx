// components/Editor.tsx
'use client'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/react-editor'
import { useRef } from 'react'

export default function MarkdownEditor({
  initialValue,
  onChange
}: {
  initialValue?: string
  onChange: (value: string) => void
}) {
  const editorRef = useRef<Editor>(null)
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Editor
        ref={editorRef}
        initialValue={initialValue || ''}
        previewStyle="vertical"
        height="600px"
        initialEditType="markdown"
        useCommandShortcut={true}
        onChange={() => {
          onChange(editorRef.current?.getInstance().getMarkdown() || '')
        }}
      />
    </div>
  )
}