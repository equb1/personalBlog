// components/admin/posts/PostForm.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PostWithTags } from '@/types/post';
import { usePostData } from '@/hooks/usePostData';
import { CategorySelect } from './PostForm/CategorySelect';
import MDEditorWrapper from './PostForm/MDEditorWrapper';
import { ActionButtons } from './PostForm/ActionButtons';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Post } from '@prisma/client';
import sanitize from 'sanitize-html';
import { ThemeConfig } from '@/types/ThemeConfig';
import { debounce } from 'lodash';
interface PostFormProps {
  initialData?: Partial<PostWithTags>;
  isEditMode?: boolean;
}

const translateToEnglish = async (text: string): Promise<string> => {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error('翻译服务不可用');

    const data = await response.json();
    return data.result || text;
  } catch (error) {
    console.error('翻译异常:', error);
    return text;
  }
};

const generateSlug = async (title: string): Promise<string> => {
  try {
    const englishText = await translateToEnglish(title);
    return englishText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 60)
      .replace(/-$/g, '');
  } catch (error) {
    console.error('Slug生成失败:', error);
    return 'untitled-post';
  }
};

const generateAISummary = async (content: string): Promise<string> => {
  try {
    const response = await fetch('/api/ai/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) throw new Error('摘要生成失败');

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('AI摘要生成失败:', error);
    throw error;
  }
};

export const PostForm = ({ initialData, isEditMode = false }: PostFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { categories } = usePostData();

  const initialExcerptRef = useRef(initialData?.excerpt || '');

  const [post, setPost] = useState<Partial<PostWithTags>>({
    title: '',
    slug: '',
    content: '# 新文章',
    excerpt: '',
    status: 'DRAFT',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    isFeatured: false,
    isPublished: false,
    coverImage: '',
    categoryId: '',
    tags: [],
    ...initialData,
  });

  const [isExcerptManuallyModified, setIsExcerptManuallyModified] = useState(
    !!initialData?.excerpt && initialData.excerpt !== initialExcerptRef.current
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const [contentHtml, setContentHtml] = useState(initialData?.contentHtml || '');
  const [themeConfig, setThemeConfig] = useState<string>(initialData?.themeConfig || 'cyanosis');

  // 防抖处理
  const debouncedUpdateContentHtml = useRef(
    debounce((html: string) => {
      setContentHtml(sanitize(html, {
        allowedTags: sanitize.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          code: ['class'],
          img: ['src', 'alt', 'width', 'height', 'class'],
        },
      }));
    }, 300)
  ).current;

  useEffect(() => {
    return () => debouncedUpdateContentHtml.cancel();
  }, []);

  useEffect(() => {
    if (isEditMode && initialData) {
      const isExcerptChanged = initialData.excerpt !== initialExcerptRef.current;
      setIsExcerptManuallyModified(isExcerptChanged);
    }
  }, [isEditMode, initialData]);

  const handleAISummary = async () => {
    if (!post.content || isExcerptManuallyModified) return;

    setIsGenerating(true);
    setGenerateError('');

    try {
      const summary = await generateAISummary(post.content);
      setPost((prev) => ({ ...prev, excerpt: summary }));
    } catch (error) {
      console.error('摘要生成失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!post.excerpt) return;
    navigator.clipboard.writeText(post.excerpt);
  };

  const handleRegenerate = async () => {
    await handleAISummary();
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/admin/media', true);

      xhr.upload.onprogress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setPost((prev) => ({ ...prev, coverImage: data.url }));
          setUploadProgress(100);
        } else {
          throw new Error(`上传失败 (${xhr.status}): ${xhr.responseText}`);
        }
      };

      xhr.send(formData);
    } catch (error) {
      console.error('图片上传失败:', error);
      alert(error instanceof Error ? error.message : '上传失败');
    }
  };

  const handleCancelUpload = () => {
    setPost((prev) => ({ ...prev, coverImage: '' }));
    setUploadProgress(0);
  };

  const handleSubmit = async (status?: Post['status']) => {
    if (!post.categoryId) return alert('请选择分类');
    if (!session?.user?.id) return alert('请先登录');

    setIsSubmitting(true);

    try {
      const selectedCategory = categories.find((c) => c.id === post.categoryId);
      if (!selectedCategory) {
        throw new Error('分类信息不正确');
      }
      const categorySlug = selectedCategory.slug;

      // 生成slug逻辑，总是根据标题生成，不需要判断是否手动修改
      const finalSlug = await generateSlug(post.title || '');

      // 强制校验
      if (!finalSlug) throw new Error('SLUG生成失败');
      if (finalSlug.length > 60) throw new Error('SLUG长度不可超过60字符');

      // 构造请求体
      const payload = {
        ...post,
        slug: finalSlug,
        status: status || 'DRAFT',
        content: post.content,
        contentHtml: contentHtml,
        themeConfig: themeConfig,
        isPublished: status === 'PUBLISHED',
        userId: session.user.id,
        metaTitle: post.metaTitle || post.title,
        metaDescription: post.metaDescription || post.excerpt,
        excerpt: post.excerpt,
      };

      // 拼接完整链接
      const fullLink = `posts/${categorySlug}/${finalSlug}`;
      console.log('完整链接:', fullLink);

      console.log('payload', payload);
      // API请求
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode
        ? `/api/admin/posts/${post.id}?postId=${post.id}`
        : '/api/admin/posts';
      console.log('url', url);

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'SLUG_CONFLICT') {
          return alert('URL标识符已存在，请修改后重试');
        }
        console.log('err', data);
        throw new Error(data.message || '提交失败');
      }

      console.log('生成结果:', data);

      if (status === 'PUBLISHED') {
        router.push(`/admin/posts?refresh=${Date.now()}`);
      } else if (!isEditMode) {
        router.push(`/admin/posts/edit/${data.id}?refresh=${Date.now()}`);
      } else {
        router.replace(`/admin/posts/edit/${post.id}?refresh=${Date.now()}`);
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert(`操作失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
      {/* 全局样式 */}
      <style jsx global>{`
        input,
        textarea,
        select {
          @apply transition-all duration-200 ease-in-out border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-2.5 text-base;
        }

        .editor-container .w-md-editor {
          @apply rounded-xl shadow-sm border-2 border-gray-200;
        }

        ::-webkit-scrollbar {
          @apply w-2 h-2;
        }
        ::-webkit-scrollbar-track {
          @apply bg-gray-100;
        }
        ::-webkit-scrollbar-thumb {
          @apply bg-gray-400 rounded-full hover:bg-gray-500;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左侧表单区域 */}
        <div className="space-y-6">
          {/* 标题区块 */}
          <div className=" p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">
                文章标题
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                value={post.title}
                onChange={(e) => setPost((p) => ({ ...p, title: e.target.value }))}
                placeholder="请输入文章标题"
                className="w-full text-2xl font-bold border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 px-4 py-3 rounded-xl"
              />
            </div>
          </div>

          {!isEditMode && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  文章链接
                </label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border-2 border-dashed border-gray-200">
                  <span className="text-gray-500">http://localhost:3000/posts/</span>
                  <span className="flex-1 bg-transparent font-mono text-blue-600 focus:outline-none">
                    {post.title ? '点击提交后自动生成' : '请先输入文章标题'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  最终生成：&quot;{(post.title || '示例标题').substring(0, 20)}&quot; → {post.slug || '提交后自动生成'}
                </p>
              </div>
            </div>
          )}

          {/* 摘要区块 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  文章摘要
                  <span className="text-gray-500 font-normal">（AI智能生成）</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleAISummary}
                    disabled={isGenerating}
                    className="px-3 py-1.5 text-sm bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 transition-all shadow-sm flex items-center gap-1"
                  >
                    {isGenerating ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        生成中...
                      </>
                    ) : (
                      '智能总结'
                    )}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all shadow-sm"
                  >
                    复制
                  </button>
                  <button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="px-3 py-1.5 text-sm bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-all shadow-sm"
                  >
                    重新生成
                  </button>
                </div>
              </div>
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500 h-32 resize-none"
                value={post.excerpt || ''}
                onChange={(e) => {
                  if (!isExcerptManuallyModified) setIsExcerptManuallyModified(true);
                  setPost((p) => ({ ...p, excerpt: e.target.value }));
                }}
                placeholder="自动生成摘要"
              />
              {generateError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  ⚠️ {generateError}
                </div>
              )}
              <p className={`text-sm ${(post.excerpt?.length || 0) > 150 ? 'text-red-500' : 'text-gray-500'}`}>
                {post.excerpt?.length || 0}/150 字符
              </p>
            </div>
          </div>
        </div>

        {/* 右侧区域 */}
        <div className="space-y-6">
          {/* 分类选择区块 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <CategorySelect
              categories={categories}
              value={post.categoryId || ''}
              onChange={(value: string) => setPost((p) => ({ ...p, categoryId: value }))}
            />
          </div>

          {/* 封面图片区块 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                封面图片
              </label>
              <ImageUpload
                onUpload={handleImageUpload}
                onCancel={handleCancelUpload}
                imageUrl={post.coverImage || ''}
                className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl transition-colors"
              />
              {uploadProgress > 0 && (
                <div className="relative pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="absolute right-0 top-3 text-sm text-blue-600">
                    {uploadProgress}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 编辑器区域 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <label className="block text-lg font-semibold text-gray-800 mb-4">
          文章内容
          <span className="text-red-500 ml-1">*</span>
        </label>
        <MDEditorWrapper
          value={post.content || ''}
          onChange={(value: string) => {
            setPost((p) => ({ ...p, content: value }));
          }}
          onHtmlChange={(html: string, theme: ThemeConfig) => {
            debouncedUpdateContentHtml(html);
            setThemeConfig(theme.preview);
          }}
        />
      </div>

      {/* 操作按钮组 */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <ActionButtons
          isSubmitting={isSubmitting}
          hasTitle={!!post.title}
          onSaveDraft={() => handleSubmit('DRAFT')}
          onSubmitReview={() => handleSubmit('PENDING')}
          isEditMode={isEditMode}
          onPublish={() => handleSubmit('PUBLISHED')}
        />
      </div>
    </div>
  );
};