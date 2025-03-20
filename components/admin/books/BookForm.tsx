// components/admin/books/BookForm.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookWithTags } from '@/types/book';
import { useBookData } from '@/hooks/useBookData';
import { CategorySelect } from './BookForm/CategorySelect';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Book } from '@prisma/client';

interface BookFormProps {
  initialData?: Partial<BookWithTags>;
  isEditMode?: boolean;
}

export const BookForm = ({ initialData, isEditMode = false }: BookFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { categories } = useBookData();

  const [book, setBook] = useState<Partial<BookWithTags>>({
    title: '',
    author: '',
    coverImage: '',
    isbn: '',
    publisher: '',
    publishYear: null,
    pages: null,
    description: '',
    readingProgress: 0,
    categoryId: '',
    tags: [],
    bookFileUrl: '', // 新增字段
    ...initialData,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 处理封面图片上传
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
          setBook((prev) => ({ ...prev, coverImage: data.url }));
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

  // 处理书籍文件上传
  const handleBookFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/admin/booksFileUpload', true);

      xhr.upload.onprogress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setBook((prev) => ({ ...prev, bookFileUrl: data.url }));
          setUploadProgress(100);
        } else {
          throw new Error(`上传失败 (${xhr.status}): ${xhr.responseText}`);
        }
      };

      xhr.send(formData);
    } catch (error) {
      console.error('书籍文件上传失败:', error);
      alert(error instanceof Error ? error.message : '上传失败');
    }
  };

  const handleCancelUpload = () => {
    setBook((prev) => ({ ...prev, coverImage: '' }));
    setUploadProgress(0);
  };

  const handleSubmit = async (status?: Book['status']) => {
    if (!book.categoryId) return alert('请选择分类');
    if (!session?.user?.id) return alert('请先登录');

    setIsSubmitting(true);

    try {
      const payload = {
        ...book,
        status: status || 'DRAFT',
        userId: session.user.id, // 确保包含 userId
        bookFileUrl: book.bookFileUrl, // 添加书籍文件 URL
      };

      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode
        ? `/api/admin/books/${book.id}`
        : '/api/admin/books';

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
        console.error('提交失败:', data);
        throw new Error(data.message || '提交失败');
      }

      console.log('生成结果:', data);

      if (status === 'PUBLISHED') {
        router.push(`/admin/books`);
      } else if (!isEditMode) {
        router.push(`/admin/books/edit/${data.id}`);
      } else {
        router.replace(`/admin/books/edit/${book.id}`);
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
      {/* 表单内容 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左侧表单区域 */}
        <div className="space-y-6">
          {/* 标题区块 */}
          <div className="p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">
                书籍标题
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                value={book.title}
                onChange={(e) => setBook((p) => ({ ...p, title: e.target.value }))}
                placeholder="请输入书籍标题"
                className="w-full text-2xl font-bold border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 px-4 py-3 rounded-xl"
              />
            </div>
          </div>

          {/* 作者区块 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                作者
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                value={book.author}
                onChange={(e) => setBook((p) => ({ ...p, author: e.target.value }))}
                placeholder="请输入作者"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500"
              />
            </div>
          </div>

          {/* ISBN 区块 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                ISBN
              </label>
              <input
                value={book.isbn || ''}
                onChange={(e) => setBook((p) => ({ ...p, isbn: e.target.value }))}
                placeholder="请输入 ISBN"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 出版社区块 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                出版社
              </label>
              <input
                value={book.publisher || ''}
                onChange={(e) => setBook((p) => ({ ...p, publisher: e.target.value }))}
                placeholder="请输入出版社"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 出版年份区块 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                出版年份
              </label>
              <input
                type="number"
                value={book.publishYear || ''}
                onChange={(e) => setBook((p) => ({ ...p, publishYear: parseInt(e.target.value, 10) || null }))}
                placeholder="请输入出版年份"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 描述区块 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                描述
              </label>
              <textarea
                value={book.description || ''}
                onChange={(e) => setBook((p) => ({ ...p, description: e.target.value }))}
                placeholder="请输入书籍描述"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 右侧区域 */}
        <div className="space-y-6">
          {/* 分类选择区块 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <CategorySelect
              categories={categories}
              value={book.categoryId || ''}
              onChange={(value: string) => setBook((p) => ({ ...p, categoryId: value }))}
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
                imageUrl={book.coverImage || ''}
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

          {/* 书籍文件上传区块 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                上传书籍文件
              </label>
              <input
                type="file"
                accept=".pdf,.epub"
                onChange={handleBookFileUpload}
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500"
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

      {/* 操作按钮组 */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => handleSubmit('DRAFT')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          保存草稿
        </button>
        <button
          onClick={() => handleSubmit('PUBLISHED')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
        >
          发布
        </button>
      </div>
    </div>
  );
};