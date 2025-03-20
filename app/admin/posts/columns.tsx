'use client'
// app/admin/posts/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Post } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const getColumns = (handleDelete: (postId: string) => void): ColumnDef<Post>[] => [
  {
    accessorKey: 'title',
    header: '标题',
  },
  {
    accessorKey: 'status',
    header: '状态',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button asChild>
          <Link href={`/admin/posts/edit/${row.original.id}`}>编辑</Link>
        </Button>
        <Button variant="destructive" onClick={() => handleDelete(row.original.id)}>
          删除
        </Button>
      </div>
    ),
  },
];