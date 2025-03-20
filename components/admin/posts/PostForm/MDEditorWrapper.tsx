// components/admin/posts/PostForm/MDEditorWrapper.tsx
'use client';
import { useState, useEffect } from 'react';
import { MdEditor, config, PreviewThemes } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import screenfull from 'screenfull';
import katex from 'katex';
import mermaid from 'mermaid';
import hljs from 'highlight.js';
import 'katex/dist/katex.min.css';
import MarkdownIt from 'markdown-it';
import { lineNumbers } from '@codemirror/view';

type ThemeConfig = {
  editor: 'light' | 'dark';
  preview: PreviewThemes;
  code: string;
};

// 配置编辑器扩展
config({
  editorExtensions: {
    screenfull: { instance: screenfull },
    katex: { instance: katex },
    mermaid: { instance: mermaid }
  },
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        type: 'frontmatter',
        plugin: () => import('markdown-it-front-matter'),
        options: {}
      }
    ];
  },
  codeMirrorExtensions(_theme, extensions) {
    return [...extensions, lineNumbers()];
  },
  markdownItConfig(md: MarkdownIt) {
    md.set({ html: true });
    
    // 增强渲染规则
    md.renderer.rules.heading_open = (tokens, idx) => {
      const level = tokens[idx].tag.slice(1);
      return `<${tokens[idx].tag} class="md-heading md-heading-${level}">`;
    };

    md.renderer.rules.image = (tokens, idx) => {
      const token = tokens[idx];
      const src = token.attrGet('src');
      const alt = token.content;
      return `<img src="${src}" alt="${alt}" class="md-image" loading="lazy">`;
    };

    // 为代码块添加主题类
    md.renderer.rules.fence = (tokens, idx) => {
      const token = tokens[idx];
      return `<pre class="md-code-block"><code>${token.content}</code></pre>`;
    };
  }
});

interface MDEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  onHtmlChange?: (html: string, theme: ThemeConfig) => void;
  initialTheme?: ThemeConfig; // 新增：父组件传递的初始主题
}

const MDEditorWrapper = ({ value, onChange, onHtmlChange, initialTheme }: MDEditorWrapperProps) => {
  // 主题状态管理
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    // 优先使用父组件传递的初始主题
    if (initialTheme) return initialTheme;

    // 如果没有传递初始主题，则从 localStorage 中读取
    const savedTheme = localStorage.getItem('mdEditorTheme');
    return savedTheme ? JSON.parse(savedTheme) : { 
      editor: 'light', 
      preview: 'cyanosis',  // 默认使用Cyanosis主题
      code: 'atom' 
    };
  });

  // 保存主题到 localStorage
  useEffect(() => {
    localStorage.setItem('mdEditorTheme', JSON.stringify(theme));
  }, [theme]);

  // 创建带主题的Markdown渲染器
  const md = new MarkdownIt({
    html: true,
    highlight: (str, lang) => {
      return `<pre class="language-${lang}" data-theme="${theme.preview}">` +
             `<code class="language-${lang}">${hljs.highlightAuto(str).value}</code></pre>`;
    }
  });

  // 处理内容变化
  const handleChange = (newValue: string) => {
    onChange(newValue); // 同步内容变化到父组件
    if (onHtmlChange) {
      const html = md.render(newValue);
      onHtmlChange(wrapWithTheme(html, theme.preview), theme); // 同步主题配置
    }
  };

  // 包装HTML内容添加主题类
  const wrapWithTheme = (html: string, themeName: string) => {
    return `<div class="md-editor-preview-theme-${themeName}">${html}</div>`;
  };

  // 图片上传处理
  const handleUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
    const urls = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/admin/media', { method: 'POST', body: formData });
        return (await response.json()).url;
      })
    );
    callback(urls);
  };

  return (
    <div className="editor-container">
      {/* 主题选择工具栏 */}
      <div className="theme-toolbar">
        <select
          value={theme.editor}
          onChange={(e) => setTheme((t) => ({ ...t, editor: e.target.value as 'light' | 'dark' }))}
        >
          <option value="light">亮色模式</option>
          <option value="dark">暗色模式</option>
        </select>

        <select
          value={theme.preview}
          onChange={(e) => setTheme((t) => ({ ...t, preview: e.target.value as PreviewThemes }))}
        >
          <option value="cyanosis">青韵主题</option>
          <option value="github">GitHub风格</option>
          <option value="mk-cute">萌系主题</option>
          <option value="smart-blue">智能蓝</option>
        </select>

        <select
          value={theme.code}
          onChange={(e) => setTheme((t) => ({ ...t, code: e.target.value as string }))}
        >
          <option value="atom">Atom风格</option>
          <option value="github">GitHub风格</option>
        </select>
      </div>

      {/* 编辑器主体 */}
      <MdEditor
        modelValue={value}
        onChange={handleChange}
        theme={theme.editor}
        previewTheme={theme.preview}
        codeTheme={theme.code}
        language="zh-CN"
        toolbars={[
          'bold', 'underline', 'italic', '-', 'title', 'strikeThrough',
          'sub', 'sup', 'quote', 'unorderedList', 'orderedList', 'task',
          '-', 'codeRow', 'code', 'link', 'image', 'table', 'mermaid',
          'katex', '-', 'revoke', 'next', 'save', '=', 'preview',
          'htmlPreview', 'catalog'
        ]}
        style={{ height: 'calc(100vh - 60px)' }}
        onUploadImg={handleUploadImg}
      />

      {/* 主题样式 */}
      <style jsx global>{`
        :root {
          --md-bk-color: #fff;
          --md-color: #333;
          --md-border-color: #e6e6e6;
        }
        :root[data-theme="dark"] {
          --md-bk-color: #1a1a1a;
          --md-color: #c9d1d9;
          --md-border-color: #30363d;
        }
        
        /* 主题工具栏样式 */
        .theme-toolbar {
          padding: 10px;
          background: var(--md-bk-color);
          border-bottom: 1px solid var(--md-border-color);
          
          select {
            margin-right: 15px;
            padding: 5px 10px;
            background: var(--md-bk-color);
            color: var(--md-color);
            border: 1px solid var(--md-border-color);
            border-radius: 4px;
            transition: all 0.2s;
            
            &:hover {
              border-color: var(--cyanosis-link-color);
            }
          }
        }

        /* 代码编辑器样式 */
        .cm-editor {
          .cm-gutters {
            background-color: var(--md-bk-color);
            border-right: 1px solid var(--md-border-color);
          }
          
          .cm-activeLineGutter {
            background-color: var(--cyanosis-blockquote-bg-color);
          }
        }

        /* 图片样式增强 */
        .md-image {
          max-width: 80%;
          margin: 1rem auto;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
          
          &:hover {
            transform: scale(1.02);
          }
        }

        /* 预览容器样式 */
        .md-editor-preview-theme-cyanosis {
          ${/* 这里会自动注入转换后的CSS变量 */ ''}
        }
      `}</style>
    </div>
  );
};

export default MDEditorWrapper;