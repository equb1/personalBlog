'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import CodeDisplayWithResult from '@/components/MDXComponents'; // 引入自定义组件
import { serialize } from 'next-mdx-remote/serialize';
import Navbar from '@/components/navigation/Navbar';
import React from 'react';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<null | {
    title: string;
    contentHtml: string;
    themeConfig?: string;
    user: { username: string; avatar?: string };
    publishedAt?: string;
    createdAt: string;
    coverImage?: string;
    excerpt?: string;
    content?: string;
  }>(null);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false); // 是否显示返回顶部按钮

  // 获取文章数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`);

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setPost(data);

        // 对 contentHtml 进行预处理，确保标签正确闭合
        const processedContent = data.contentHtml
          .replace(/<p>(.*?)<\/p>/g, (_match: any, p1: any) => {
            return `<p>${p1}</p>`;
          })
          .replace(/<p>(.*)/g, (_match: any, p1: any) => {
            return `<p>${p1}</p>`;
          })
          .replace(/<\/p><\/p>/g, '</p>') // 移除多余的 </p> 标签
          .replace(/<\/div><\/p>/g, '</div>') // 移除 </div> 后的 </p>
          .replace(/<div><\/p>/g, '<div>') // 移除 <div> 后的 </p>
          .replace(/<p><\/div>/g, '</div>') // 移除 <p> 后的 </div>
          .replace(/<\/p><div>/g, '<div>') // 移除 </p> 后的 <div>
          .replace(/<div>(.*?)<\/div>/g, (match: any, p1: any) => {
            return `<div>${p1}</div>`;
          })
          .replace(/<div>(.*)<\/div>/s, (_match: any, p1: any) => {
            return p1;
          })
          .replace(/<img[^>]*><\/p>/g, (match: any) => {
            return match.replace('</p>', ''); // 移除 <img> 标签后面的 </p>
          });

        console.log("输出的内容", processedContent);

        // 序列化 MDX 内容
        const serialized = await serialize(processedContent, {
          scope: { CodeDisplayWithResult } // 确保自定义组件被包含
        });
        console.log("serialized", serialized);

        setMdxSource(serialized);
        console.log("mdxsource", mdxSource);
      } catch (error) {
        console.error('数据获取失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug, router]);

  // 动态加载主题样式
  useEffect(() => {
    if (post?.themeConfig) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/themes/${post.themeConfig}.css`;
      link.onload = () => {
        setStylesLoaded(true);
      };
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    } else {
      setStylesLoaded(true);
    }
  }, [post?.themeConfig]);

  // 解析文章内容生成目录
  useEffect(() => {
    if (post?.contentHtml) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.contentHtml, 'text/html');

      // 使用更可靠的ID生成方式
      let index = 0;
      const headingElements = Array.from(doc.querySelectorAll('h1, h2, h3'));

      const newHeadings = headingElements.map((heading) => {
        const baseId = heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')  // 支持中文
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || `heading-${index++}`;

        return {
          id: baseId,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.substring(1))
        };
      });

      setHeadings(newHeadings);

      // 更新正文内容中的标题ID
      let html = post.contentHtml;
      headingElements.forEach((heading, i) => {
        html = html.replace(heading.outerHTML, () => {
          const newHeading = heading.cloneNode(true) as HTMLElement;
          newHeading.id = newHeadings[i].id;
          return newHeading.outerHTML;
        });
      });

      setPost(prev => prev ? { ...prev, contentHtml: html } : null);
    }
  }, [post?.contentHtml]);

  // 滚动监听效果
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const visibleHeadings = entries
              .filter(e => e.isIntersecting)
              .map(e => ({

                id: e.target.id,
                ratio: e.intersectionRatio,
                top: e.boundingClientRect.top
              }));

            // 找出最接近顶部的可见标题
            const closest = visibleHeadings.reduce((prev, curr) => {
              return Math.abs(curr.top) < Math.abs(prev.top) ? curr : prev;
            });

            setActiveId(closest.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',  // 优化可视区域
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    observerRef.current = observer;

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);

  // 阅读进度条
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / totalHeight) * 100);

      // 显示或隐藏返回顶部按钮
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 返回顶部按钮点击事件
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!stylesLoaded) {
    return <div>加载样式中...</div>;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        加载中...
      </div>
    );
  }

  if (!post) return null;

  // 主题配置
  const themeConfig = {
    preview: post.themeConfig || 'cyanosis',
  };

  // 目录导航组件
  type Heading = {
    id: string;
    level: number;
    text: string;
  };

  interface TableOfContentsProps {
    headings: Heading[];
    activeId: string | null;
  }

  // 修改目录项的点击处理
  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 100; // 根据实际header高度调整
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // 手动触发一次IntersectionObserver检查
      setTimeout(() => {
        observerRef.current?.observe(element);
      }, 1000);

      // 点击后收起目录
      setShowMobileMenu(false);
    }
  };

  const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, activeId }) => (
    <nav className="space-y-2 transition-all duration-300">
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey) return;
            e.preventDefault();
            handleHeadingClick(heading.id);
          }}
          className={`block text-sm 
            ${heading.id === activeId ?
              'text-gray-800 dark:text-gray-200 font-medium' :
              'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}
            ${heading.level === 1 ? 'pl-0' : heading.level === 2 ? 'pl-3' : 'pl-6'}
            transition-colors duration-200`} // 移除默认悬停动画
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );

  // 更新后的摘要卡片组件
  function ExcerptCard({ excerpt }: { excerpt: string }) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-blue-200 dark:border-gray-600 shadow-sm">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            文章摘要
          </h3>
          <svg
            className={`w-5 h-5 transform transition-transform duration-500 ${!isCollapsed ? 'rotate-180' : ''
              } text-blue-600 dark:text-blue-300`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {!isCollapsed && (
          <div className="px-4 pb-4 transition-all duration-500 ease-in-out">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {excerpt}
            </p>
          </div>
        )}
      </div>
    );
  }

  // 更新后的布局代码
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="fixed top-16 left-0 h-1 bg-blue-500 z-40" style={{ width: `${scrollProgress}%` }} />

      <div className=" px-4 py-8 mt-16">
        <div className="lg:flex lg:gap-8 lg:w-[80vw] mx-auto">
          <article className="lg:flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 ">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">{post.title}</h1>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  {post.user.avatar && (
                    <img
                      src={post.user.avatar}
                      className="w-8 h-8 rounded-full"
                      alt={post.user.username}
                      onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                    />
                  )}
                  <span>{post.user.username}</span>
                </div>
                <span>•</span>
                <time>{formatDate(post.publishedAt || post.createdAt)}</time>
              </div>
            </div>

            {post.excerpt && <ExcerptCard excerpt={post.excerpt} />}

            <div className="md-editor-preview">
              <div
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
                style={{
                  backgroundColor: 'var(--md-bg-color)',
                  color: 'var(--md-color)',
                }}
              />
            </div>
          </article>

          <aside className="hidden lg:block lg:w-64 xl:w-80 lg:sticky lg:top-20 lg:self-start lg:ml-8">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">目录导航</h3>
                <button
                  onClick={() => setIsTocCollapsed(!isTocCollapsed)}
                  className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-full transition-colors duration-500"
                >
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-500 ${!isTocCollapsed ? 'rotate-180' : ''
                      } text-gray-600 dark:text-gray-300`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div className={`overflow-hidden transition-all duration-500 ${isTocCollapsed ? 'max-h-0' : 'max-h-[80vh]'}
                `}>
                <TableOfContents headings={headings} activeId={activeId} />
              </div>
            </nav>
          </aside>
        </div>

        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
            <div className="absolute right-0 top-0 h-full w-72 bg-white/95 dark:bg-gray-800/95 p-4 shadow-xl backdrop-blur-lg transition-transform duration-300 ease-in-out transform translate-x-0"
              onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4 flex justify-between items-center text-gray-800 dark:text-gray-200 mt-16">
                目录导航
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-full transition-colors duration-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </h3>
              <div className="overflow-y-auto h-[calc(100%-3rem)] mt-16">
                <TableOfContents headings={headings} activeId={activeId} />
              </div>
            </div>
          </div>
        )}

        {/* 目录按钮 */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden fixed right-4 bottom-16 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 返回顶部按钮 */}
        {showTopButton && (
          <button
            onClick={scrollToTop}
            className="fixed right-4 bottom-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}