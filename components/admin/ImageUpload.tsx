'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { TrashIcon } from 'lucide-react';
import Image from 'next/image'; // 引入 next/image

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>; // 上传回调
  onCancel: () => void; // 取消上传回调
  imageUrl?: string; // 已上传的图片 URL
  className?: string;
}

export const ImageUpload = ({ onUpload, onCancel, imageUrl, className }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 预览图片 URL

  // 处理上传
  const handleUpload = async (file: File) => {
    try {
      setError('');
      setIsUploading(true);
      await onUpload(file); // 调用父组件的上传回调
    } catch {
      setError('上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  // 处理拖拽事件
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else {
      setIsDragging(false);
    }
  }, []);

  // 处理文件拖放
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setPreviewUrl(URL.createObjectURL(file)); // 生成预览 URL
      handleUpload(file); // 开始上传
    }
  }, [handleUpload]);

  // 处理文件选择
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setPreviewUrl(URL.createObjectURL(file)); // 生成预览 URL
      handleUpload(file); // 开始上传
    }
  }, [handleUpload]);

  // 处理取消上传
  const handleCancel = () => {
    setPreviewUrl(null);
    onCancel(); // 调用父组件的取消回调
  };

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-6 transition-colors',
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
        error && 'border-red-500 bg-red-50',
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer text-gray-600 hover:text-gray-800"
        >
          <div className="space-y-2">
            <div className="text-lg font-medium">
              {isUploading ? '上传中...' : '点击选择或拖拽图片到这里'}
            </div>
            <div className="text-sm text-gray-500">
              支持 JPG, PNG, WebP 格式，最大5MB
            </div>
          </div>
        </label>

        {/* 图片预览 */}
        {(previewUrl || imageUrl) && (
          <div className="mt-4 relative group">
            <Image
              src={previewUrl || imageUrl || ''} // 确保 src 是字符串
              alt="封面预览"
              className="max-h-48 rounded-md object-cover"
              width={500}
              height={300}
            />
            {/* 取消图片按钮 */}
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="text-red-600 text-sm mt-2">{error}</div>
        )}
      </div>
    </div>
  );
};