// app/api/columns/route.ts
import { NextResponse } from 'next/server';

// 定义表格列数据
const columns = [
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
    header: '操作',
  },
];

// 获取表格列数据
export async function GET() {
  try {
    return NextResponse.json(columns);
  } catch (error) {
    console.error('获取列数据失败:', error);
    return NextResponse.json(
      { message: '服务器错误，请查看日志' },
      { status: 500 }
    );
  }
}