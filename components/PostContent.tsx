'use client';
import React, { useEffect, useState, useRef } from 'react';

// 定义 PostContent 组件的属性类型
interface PostContentProps {
  contentHtml: string;
  theme: string;
}

const PostContent: React.FC<PostContentProps> = ({ contentHtml }) => {
  // 用于存储修改后的 HTML 内容
  const [modifiedHtml, setModifiedHtml] = useState(contentHtml);
  // 创建一个 ref 用于引用包含代码块的容器元素
  const containerRef = useRef<HTMLDivElement>(null);

  // 第一次 useEffect：处理 contentHtml，添加代码块头部和复制按钮，以及处理答案部分
  useEffect(() => {
    // 函数用于为 HTML 中的代码块添加结构（代码语言和复制按钮）
    const addCodeBlockStructure = (html: string): string => {
      // 正则表达式匹配 <pre> 标签及其内容
      const preRegex = /<pre[^>]*>.*?<\/pre>/gs;
    
      // 替换函数，用于处理每个 <pre> 标签
      return html.replace(preRegex, (match) => {
        // 解析当前 <pre> 标签的 HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(match, 'text/html');
        const pre = doc.querySelector('pre');
        if (!pre) return match;
    
        const code = pre.querySelector('code');
        if (!code) return match;
    
        // 提取代码语言
        const langMatch = code.className.match(/language-(\w+)/);
        const lang = langMatch ? langMatch[1] : 'unknown';
    
        // 创建代码头部元素
        const codeHeader = doc.createElement('div');
        codeHeader.className = 'code-header';
    
        // 创建代码语言显示元素
        const codeLang = doc.createElement('span');
        codeLang.className = 'code-lang';
        codeLang.textContent = lang;
    
        // 创建复制按钮
        const copyButton = doc.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
    
        // 将代码语言和复制按钮添加到代码头部
        codeHeader.appendChild(codeLang);
        codeHeader.appendChild(copyButton);
    
        // 创建代码块包装元素
        const codeBlockWrapper = doc.createElement('div');
        codeBlockWrapper.className = 'code-block-wrapper';
        codeBlockWrapper.appendChild(codeHeader);
        codeBlockWrapper.appendChild(pre);
    
        // 返回新的 HTML 结构
        return codeBlockWrapper.outerHTML;
      });
    };

    // 函数用于处理答案部分
    const addAnswerToggle = (html: string): string => {
      // 正则表达式匹配 <!--answer--> 和 <!--/answer--> 注释
      const answerRegex = /<!--answer-->(.*?)<!--\/answer-->/gs;
    
      // 替换函数，用于处理每个答案部分
      return html.replace(answerRegex, (match, content) => {
        // 创建答案容器
        const answerContainer = document.createElement('div');
        answerContainer.className = 'answer-container';
    
        // 创建按钮
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-answer-button';
        toggleButton.textContent = '显示答案';
    
        // 创建答案内容容器
        const answerContent = document.createElement('div');
        answerContent.className = 'answer-content';
        answerContent.innerHTML = content;
        answerContent.style.display = 'none'; // 默认隐藏
    
        // 将按钮和答案内容添加到容器
        answerContainer.appendChild(toggleButton);
        answerContainer.appendChild(answerContent);
    
        // 返回新的 HTML 结构
        return answerContainer.outerHTML;
      });
    };

    // 调用函数处理 contentHtml
    const newHtml = addCodeBlockStructure(contentHtml);
    const finalHtml = addAnswerToggle(newHtml);
    // 更新修改后的 HTML 内容
    setModifiedHtml(finalHtml);
  }, [contentHtml]);

  // 第二次 useEffect：在客户端渲染完成后，为复制按钮和答案切换按钮添加点击事件监听器
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // 查找所有的复制按钮
      const copyButtons = container.querySelectorAll('.copy-button');
      copyButtons.forEach((button) => {
        // 找到对应的代码元素
        const codeElement = button.closest('.code-block-wrapper')?.querySelector('code');
        if (codeElement) {
          // 为复制按钮添加点击事件监听器
          button.addEventListener('click', async () => {
            try {
              if ('clipboard' in navigator) {
                // 使用现代剪贴板 API 复制代码
                await navigator.clipboard.writeText(codeElement.textContent || '');
              } else {
                // 旧版浏览器兼容方案
                const textArea = document.createElement('textarea');
                textArea.value = codeElement.textContent || '';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
              }
              // 复制成功后更新按钮文本
              button.textContent = 'Copied';
              // 2 秒后恢复按钮文本
              setTimeout(() => {
                button.textContent = 'Copy';
              }, 2000);
            } catch (error) {
              console.error('Failed to copy text: ', error);
            }
          });
        }
      });

      // 查找所有的答案切换按钮
      const toggleButtons = container.querySelectorAll('.toggle-answer-button');
      toggleButtons.forEach((button) => {
        // 找到对应的答案内容
        const answerContent = button.nextElementSibling as HTMLElement;
        if (answerContent) {
          // 为按钮添加点击事件监听器
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