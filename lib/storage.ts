import { writeFile } from "fs/promises"
import { join } from "path"
import { S3 } from '@aws-sdk/client-s3' // 正确导入方式
const AWS = {
    S3: S3
  }
  
// lib/storage.ts
export async function uploadFile(file: File) {
    if (process.env.NODE_ENV === 'development') {
      // 本地存储到public/uploads
      const path = join(process.cwd(), 'public/uploads', file.name)
      await writeFile(path, Buffer.from(await file.arrayBuffer()))
      return `/uploads/${file.name}`
    } else {
      // 生产环境使用S3
      const s3 = new AWS.S3({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
        })
    }
  }
  