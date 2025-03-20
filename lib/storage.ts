import { writeFile } from "fs/promises"
import { join } from "path"

// lib/storage.ts
export async function uploadFile(file: File) {
    if (process.env.NODE_ENV === 'development') {
      // 本地存储到public/uploads
      const path = join(process.cwd(), 'public/uploads', file.name)
      await writeFile(path, Buffer.from(await file.arrayBuffer()))
      return `/uploads/${file.name}`
    } else {
      // 生产环境使用S3
    }
  }
  