// components/admin/posts/PostForm/TagSelect.tsx
'use client';

import { Tag } from '@prisma/client';
import { useState, useEffect } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';

interface TagSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const TagSelect = ({ value, onChange }: TagSelectProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const options = tags.map(tag => ({
    value: tag.id,
    label: tag.name
  }));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        文章标签
      </label>
      <MultiSelect
        options={options}
        selected={value}
        onChange={onChange}
        placeholder="选择标签..."
        isLoading={isLoading}
        createable
        onCreate={async (name: any) => {
          const response = await fetch('/api/tags', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name })
          });
          const newTag = await response.json();
          setTags(prev => [...prev, newTag]);
          return newTag.id;
        }}
      />
      <p className="text-sm text-gray-500">最多可选择5个标签</p>
    </div>
  );
};