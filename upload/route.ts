import { NextResponse } from 'next/server'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs from 'fs/promises'  // 直接从 fs/promises 导入
import path from 'path'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  try {
    // 通用配置
    const fileBuffer = await file.arrayBuffer()
    const ext = file.name.split('.').pop()
    const key = `carousel/${Date.now()}.${ext}`

    // 环境判断逻辑
    if (process.env.NODE_ENV === 'development') {
      // 本地存储
      const uploadDir = path.join(process.cwd(), 'public/uploads')
      await fs.writeFile(
        path.join(uploadDir, key),
        Buffer.from(fileBuffer)
      )
      return NextResponse.json({ url: `/uploads/${key}` })
    } else {
      // 生产环境使用S3
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: Buffer.from(fileBuffer),
        ContentType: file.type,
        ACL: 'public-read'
      }))
      return NextResponse.json({ 
        url: `https://${process.env.S3_CDN_DOMAIN}/${key}`
      })
    }
  } catch (error) {
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    )
  }
}
