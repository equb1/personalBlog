// components/admin/posts/PostForm/CategorySelect.tsx
'use client';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { Category } from '@prisma/client';

interface CategorySelectProps {
    categories: Category[];
    value: string;
    onChange: (value: string) => void;
}

export const CategorySelect = ({ categories, value, onChange }: CategorySelectProps) => (
    <div className="space-y-2">
        <label className="flex items-center text-gray-700">
            分类选择
            <span className="text-red-500 ml-1">*</span>
        </label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={`h-12 text-base rounded-lg ${!value ? 'border-red-500' : ''}`}>
                <SelectValue placeholder={categories.length ? "请选择分类" : "加载分类中..."} />
            </SelectTrigger>
            {/* 主要修改：添加 position="popper" 属性 */}
            <SelectContent
                position="popper"
                className="max-h-60 shadow-xl rounded-lg border border-gray-100 z-[100]"
                side="bottom" // 可选，明确指定下方弹出
            >
                {categories.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">暂无可用分类</div>
                ) : (
                    <div className="space-y-1 p-2">
                        {categories.map(category => (
                            <SelectItem
                                key={category.id}
                                value={category.id}
                                className="py-3 px-4 rounded-md hover:bg-blue-50 data-[state=checked]:bg-blue-100"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-base font-medium flex-1 truncate">{category.name}</span>
                                    {category.description && (
                                        <span className="text-sm text-gray-500 truncate max-w-[120px]">
                                            ({category.description})
                                        </span>
                                    )}
                                </div>
                            </SelectItem>
                        ))}
                    </div>
                )}
            </SelectContent>
        </Select>
    </div>
);