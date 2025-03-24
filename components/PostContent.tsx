'use client';
import React, { useEffect, useState, useRef } from 'react';

interface PostContentProps {
  contentHtml: string;
  theme: string;
}

const PostContent: React.FC<PostContentProps> = ({ contentHtml }) => {
  const [modifiedHtml, setModifiedHtml] = useState(contentHtml);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 处理代码块结构和答案切换
  useEffect(() => {
    const addCodeBlockStructure = (html: string): string => {
      const preRegex = /<pre[^>]*>.*?<\/pre>/gs;

      return html.replace(preRegex, (match) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(match, 'text/html');
        const pre = doc.querySelector('pre');
        if (!pre) return match;

        const code = pre.querySelector('code');
        if (!code) return match;

        const langMatch = code.className.match(/language-(\w+)/);
        const lang = langMatch ? langMatch[1] : 'unknown';

        const codeHeader = doc.createElement('div');
        codeHeader.className = 'code-header';

        const codeLang = doc.createElement('span');
        codeLang.className = 'code-lang';
        codeLang.textContent = lang;

        const copyButton = doc.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';

        codeHeader.appendChild(codeLang);
        codeHeader.appendChild(copyButton);

        const codeBlockWrapper = doc.createElement('div');
        codeBlockWrapper.className = 'code-block-wrapper';
        codeBlockWrapper.appendChild(codeHeader);
        codeBlockWrapper.appendChild(pre);

        return codeBlockWrapper.outerHTML;
      });
    };

    const addAnswerToggle = (html: string): string => {
      const answerRegex = /<!--answer-->(.*?)<!--\/answer-->/gs;

      return html.replace(answerRegex, (match, content) => {
        const answerContainer = document.createElement('div');
        answerContainer.className = 'answer-container';

        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-answer-button';
        toggleButton.textContent = '显示答案';

        const answerContent = document.createElement('div');
        answerContent.className = 'answer-content';
        answerContent.innerHTML = content;
        answerContent.style.display = 'none';

        answerContainer.appendChild(toggleButton);
        answerContainer.appendChild(answerContent);

        return answerContainer.outerHTML;
      });
    };

    const newHtml = addCodeBlockStructure(contentHtml);
    const finalHtml = addAnswerToggle(newHtml);
    setModifiedHtml(finalHtml);
  }, [contentHtml]);

  // 添加事件监听器
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const copyButtons = container.querySelectorAll('.copy-button');
      copyButtons.forEach((button) => {
        const codeElement = button.closest('.code-block-wrapper')?.querySelector('code');
        if (codeElement) {
          button.addEventListener('click', async () => {
            try {
              if ('clipboard' in navigator) {
                await navigator.clipboard.writeText(codeElement.textContent || '');
              } else {
                const textArea = document.createElement('textarea');
                textArea.value = codeElement.textContent || '';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
              }
              button.textContent = 'Copied';
              setTimeout(() => {
                button.textContent = 'Copy';
              }, 2000);
            } catch (error) {
              console.error('Failed to copy text: ', error);
            }
          });
        }
      });

      const toggleButtons = container.querySelectorAll('.toggle-answer-button');
      toggleButtons.forEach((button) => {
        const answerContent = button.nextElementSibling as HTMLElement;
        if (answerContent) {
          button.addEventListener('click', () => {
            if (answerContent.style.display === 'none') {
              answerContent.style.display = 'block';
              button.textContent = '隐藏答案';
            } else {
              answerContent.style.display = 'none';
              button.textContent = '显示答案';
            }
          });
        }
      });
    }
  }, [modifiedHtml]);

  return (
    <div
      ref={containerRef}
      className="markdown-body mdx-content"
      dangerouslySetInnerHTML={{ __html: modifiedHtml }}
    />
  );
};

export default PostContent;