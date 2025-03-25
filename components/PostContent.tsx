'use client';
import React, { useEffect, useState, useRef } from 'react';

interface PostContentProps {
  contentHtml: string;
  theme?: string;
}

const PostContent: React.FC<PostContentProps> = ({ contentHtml, theme = 'cyanosis' }) => {
  const [modifiedHtml, setModifiedHtml] = useState(contentHtml);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!contentHtml) {
      setModifiedHtml('<p>内容加载中...</p>');
      return;
    }

    const processHtml = (html: string) => {
      // 处理代码块
      const withCodeBlocks = html.replace(/<pre[^>]*>.*?<\/pre>/gs, (match) => {
        const doc = new DOMParser().parseFromString(match, 'text/html');
        const pre = doc.querySelector('pre');
        if (!pre) return match;

        const code = pre.querySelector('code');
        const lang = code?.className.match(/language-(\w+)/)?.[1] || 'text';

        return `
          <div class="code-block-wrapper ${theme}">
            <div class="code-header">
              <span class="code-lang">${lang}</span>
              <button class="copy-button">Copy</button>
            </div>
            ${pre.outerHTML}
          </div>
        `;
      });

      // 处理答案区块
      return withCodeBlocks.replace(
        /<!--answer-->(.*?)<!--\/answer-->/gs, 
        (_, content) => `
          <div class="answer-container ${theme}">
            <button class="toggle-answer-button">显示答案</button>
            <div class="answer-content" style="display:none">
              ${content}
            </div>
          </div>
        `
      );
    };

    setModifiedHtml(processHtml(contentHtml));
  }, [contentHtml, theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 复制按钮功能
    const handleCopy = (e: MouseEvent) => {
      const button = e.target as HTMLButtonElement;
      if (!button.classList.contains('copy-button')) return;

      const code = button.closest('.code-block-wrapper')?.querySelector('code');
      if (!code) return;

      navigator.clipboard.writeText(code.textContent || '')
        .then(() => {
          button.textContent = 'Copied!';
          setTimeout(() => button.textContent = 'Copy', 2000);
        })
        .catch(err => console.error('Copy failed:', err));
    };

    // 答案切换功能
    const handleToggle = (e: MouseEvent) => {
      const button = e.target as HTMLButtonElement;
      if (!button.classList.contains('toggle-answer-button')) return;

      const content = button.nextElementSibling as HTMLElement;
      if (!content) return;

      content.style.display = content.style.display === 'none' ? 'block' : 'none';
      button.textContent = content.style.display === 'none' ? '显示答案' : '隐藏答案';
    };

    container.addEventListener('click', handleCopy);
    container.addEventListener('click', handleToggle);

    return () => {
      container.removeEventListener('click', handleCopy);
      container.removeEventListener('click', handleToggle);
    };
  }, [modifiedHtml]);

  return (
    <div
      ref={containerRef}
      className={`markdown-body ${theme}`}
      dangerouslySetInnerHTML={{ __html: modifiedHtml }}
    />
  );
};

export default PostContent;