// components/admin/posts/PostForm/index.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { PostWithTags } from '@/types/post';
import { usePostData } from '@/hooks/usePostData';
import { CategorySelect } from './CategorySelect';
import MDEditorWrapper from './MDEditorWrapper';
import { ActionButtons } from './ActionButtons';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Post } from '@prisma/client';

// 百度翻译API封装
const translateToEnglish = async (text: string): Promise<string> => {
  const APP_ID = process.env.NEXT_PUBLIC_BAIDU_TRANSLATE_APPID;
  const APP_KEY = process.env.NEXT_PUBLIC_BAIDU_TRANSLATE_KEY;

  if (!APP_ID || !APP_KEY) {
    console.error('百度翻译API未正确配置');
    return text;
  }

  try {
    const salt = Date.now().toString();
    const sign = CryptoJS.MD5(APP_ID + text + salt + APP_KEY).toString();

    const response = await fetch(
      'https://api.fanyi.baidu.com/api/trans/vip/translate?' +
      new URLSearchParams({
        q: text,
        from: 'zh',
        to: 'en',
        appid: APP_ID,
        salt,
        sign
      })
    );

    if (!response.ok) {
      throw new Error(`HTTP错误 ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error_code) {
      console.error(`百度翻译错误 ${data.error_code}: ${data.error_msg}`);
      return text;
    }

    return data.trans_result?.[0]?.dst || text;

  } catch (error) {
    console.error('翻译失败:', error);
    return text;
  }
};

// Slug生成逻辑
const generateSlug = async (title: string): Promise<string> => {
  try {
    const englishText = await translateToEnglish(title);
    return englishText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // 移除特殊字符
      .replace(/\s+/g, '-')      // 空格转连字符
      .replace(/-+/g, '-')       // 合并重复连字符
      .trim()                    // 去除首尾空格
      .substring(0, 60)          // 截断长度
      .replace(/-$/g, '');       // 去除末尾连字符
  } catch (error) {
    console.error('Slug生成失败:', error);
    return 'untitled-post';
  }
};

export const PostForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { categories } = usePostData();

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
  });

  const [slugLoading, setSlugLoading] = useState(false);
  const [isSlugManuallyModified, setIsSlugManuallyModified] = useState(false);
  const [isExcerptManuallyModified, setIsExcerptManuallyModified] = useState(false);

  // 智能生成Slug（带防抖）
  useEffect(() => {
    const updateSlug = async () => {
      if (!isSlugManuallyModified && post.title) {
        setSlugLoading(true);
        try {
          const generatedSlug = await generateSlug(post.title);
          setPost(prev => ({ ...prev, slug: generatedSlug }));
        } finally {
          setSlugLoading(false);
        }
      }
    };

    const timer = setTimeout(updateSlug, 500);
    return () => clearTimeout(timer);
  }, [post.title, isSlugManuallyModified]);

  // 自动生成摘要
  useEffect(() => {
    if (!isExcerptManuallyModified && post.content) {
      const plainText = post.content
        .replace(/#+\s*/g, '')   // 移除Markdown标题
        .replace(/[*_`]/g, '')   // 移除基本格式符号
        .replace(/\n/g, ' ')     // 替换换行为空格
        .substring(0, 150)
        .trim();

      setPost(prev => ( {
        ...prev,
        excerpt: `${plainText}${plainText.length === 150 ? '...' : ''}`
      }));
    }
  }, [post.content, isExcerptManuallyModified]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
          setPost(prev => ({ ...prev, coverImage: data.url }));
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
    setPost(prev => ({ ...prev, coverImage: '' }));
    setUploadProgress(0);
  };

  const handleSubmit = async (status?: Post['status']) => {
    if (!post.categoryId) return alert('请选择分类');
    if (!post.slug) return alert('URL标识符不能为空');
    if (!session?.user?.id) return alert('请先登录');

    setIsSubmitting(true);
    try {
      const payload = {
        ...post,
        status: status || post.status,
        isPublished: status === 'PUBLISHED',
        userId: session.user.id,
        metaTitle: post.metaTitle || post.title,
        metaDescription: post.metaDescription || post.excerpt,
      };

      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.code === 'SLUG_CONFLICT') {
          return alert('URL标识符已存在，请修改后重试');
        }
        throw new Error(errorData.message || '提交失败');
      }

      const result = await res.json();
      router.push(`/admin/posts/edit/${result.id}`);
    } catch (error) {
      console.error('提交失败:', error);
      alert(error instanceof Error ? error.message : '提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 左侧内容区 */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label>文章标题</label>
            <input
              value={post.title}
              onChange={e => setPost(p => ({ ...p, title: e.target.value }))}
              placeholder="请输入文章标题"
              className="text-2xl font-bold w-full border rounded p-2"
            />
          </div>

          <div className="space-y-2">
            <label>文章链接</label>
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border">
              <span className="text-gray-500">https://yourdomain.com/posts/</span>
              <input
                value={post.slug}
                onChange={e => {
                  setPost(p => ({ ...p, slug: e.target.value }));
                  setIsSlugManuallyModified(true);
                }}
                placeholder="生成中..."
                className="flex-1 bg-transparent font-mono text-blue-600"
                disabled={slugLoading}
              />
              {slugLoading && (
                <span className="animate-pulse text-gray-500">生成中...</span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              示例：&quot;{(post.title || '示例标题').substring(0, 20)}&quot; → {post.slug || '自动生成英文链接'}
            </p>
          </div>

          <div className="space-y-2">
            <label>文章摘要</label>
            <textarea
              value={post.excerpt || ''}
              onChange={e => {
                setPost(p => ({ ...p, excerpt: e.target.value }));
                setIsExcerptManuallyModified(true);
              }}
              placeholder="自动生成摘要"
              className="w-full border rounded p-2 h-24"
            />
            <p className="text-sm text-gray-500">
              {post.excerpt?.length || 0}/150 字符
            </p>
          </div>
        </div>

        {/* 右侧控制区 */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label>文章分类</label>
            <CategorySelect
              categories={categories}
              value={post.categoryId || ''}
              onChange={value => setPost(p => ({ ...p, categoryId: value }))}
            />
          </div>

          <div className="space-y-2">
            <label>封面图片</label>
            <ImageUpload
              onUpload={handleImageUpload}
              onCancel={handleCancelUpload}
              imageUrl={post.coverImage || ''}
            />
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <label>文章内容</label>
        <MDEditorWrapper
          value={post.content || ''}
          onChange={(value: string) => setPost(p => ({ ...p, content: value }))}
        />
      </div>

      <div className="flex justify-between items-center">
        <ActionButtons
          isSubmitting={isSubmitting}
          hasTitle={!!post.title}
          onSaveDraft={() => handleSubmit('DRAFT')}
          onSubmitReview={() => handleSubmit('PENDING')}
          onPublish={() => handleSubmit('PUBLISHED')}
        />
      </div>
    </div>
  );
};