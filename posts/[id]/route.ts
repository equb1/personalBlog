import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 新增参数验证中间件
const validateParams = (params: { id: string }) => {
  if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(params.id)) {
    return NextResponse.json(
      { error: "无效的UUID格式" },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 参数验证
  const validationResponse = validateParams(params)
  if (validationResponse) return validationResponse

  try {
    // 使用事务保证数据一致性
    const result = await prisma.$transaction([
      prisma.comment.deleteMany({
        where: { postId: params.id }
      }),
      prisma.postTags.deleteMany({
        where: { postId: params.id }
      }),
      prisma.post.delete({
        where: { id: params.id }
      })
    ])

    return NextResponse.json({
      success: true,
      deletedCounts: {
        comments: result[0].count,
        tags: result[1].count
      }
    })
  } catch (error: any) {
    // 安全处理错误日志
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    console.error('[DELETE Error]', errorMessage)

    // 处理 Prisma 已知错误
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "目标数据不存在或已被删除" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "操作失败", details: errorMessage },
      { status: 500 }
    )
  }
}
