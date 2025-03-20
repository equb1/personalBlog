'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { type Language } from 'prism-react-renderer';
import { useTheme } from 'next-themes';

interface CodePlaygroundProps {
  code: string;
  language?: Language;
  editable?: boolean;
  previewHeight?: string;
}

export default function CodePlayground({
  code: initialCode,
  language = 'javascript',
  editable = true,
  previewHeight = '400px'
}: CodePlaygroundProps) {
  const { theme } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  useEffect(() => {
    setEditorTheme(theme === 'dark' ? 'vs-dark' : 'light');
  }, [theme]);

  return (
    <div className="my-8 space-y-4 [&_.monaco-editor]:!pt-4 [&_.monaco-editor]:!pb-8">
      <div className="rounded-lg overflow-hidden border dark:border-gray-700">
        {editable ? (
          <LiveProvider code={code} language={language}>
            <div className="relative group">
              <div className="absolute right-2 top-2 z-10 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-300">
                {language}
              </div>
              <LiveEditor
                onChange={setCode}
                theme={editorTheme as any}
                className="!font-mono"
                style={{
                  minHeight: '200px',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                }}
              />
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900" style={{ minHeight: previewHeight }}>
              <LivePreview className="!mt-0" />
              <LiveError className="text-red-500 mt-2 text-sm font-mono" />
            </div>
          </LiveProvider>
        ) : (
          <Editor
            value={code}
            language={language}
            theme={editorTheme}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
            height={previewHeight}
          />
        )}
      </div>

      {editable && (
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center">
            <span className="i-lucide-edit-3 mr-1 w-4 h-4" />
            可编辑代码
          </span>
          <span className="flex items-center">
            <span className="i-lucide-refresh-cw mr-1 w-4 h-4" />
            实时预览
          </span>
        </div>
      )}
    </div>
  );
}