// components/ui/multi-select.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  createable?: boolean;
  onCreate?: (name: string) => Promise<string>;
}

export const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  isLoading = false,
  createable = false,
  onCreate
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleCreate = async () => {
    if (!searchValue.trim() || !onCreate) return;
    
    setIsCreating(true);
    try {
      const newId = await onCreate(searchValue);
      onChange([...selected, newId]);
      setSearchValue('');
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-full p-2 border rounded-md cursor-pointer hover:border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selected.length > 0 ? (
            selected.map(id => {
              const option = options.find(o => o.value === id);
              return (
                <span
                  key={id}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center gap-1"
                >
                  {option?.label}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleSelect(id);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="p-2 border-b">
            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="搜索标签..."
              className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">加载中...</div>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <div
                    key={option.value}
                    className={`flex items-center p-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      selected.includes(option.value) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span className="flex-1">{option.label}</span>
                    {selected.includes(option.value) && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">未找到匹配项</div>
              )}

              {createable && searchValue.trim() && !filteredOptions.some(o => 
                o.label.toLowerCase() === searchValue.toLowerCase()
              ) && (
                <div
                  className="flex items-center p-2 text-sm cursor-pointer hover:bg-gray-100 text-blue-600"
                  onClick={handleCreate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isCreating ? '创建中...' : `创建 "${searchValue}"`}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};