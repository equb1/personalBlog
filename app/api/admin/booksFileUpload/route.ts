// app/api/admin/media/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    // 解析 FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '未选择文件' }, { status: 400 });
    }

    // // 检查文件类型
    // if (!file.type.startsWith('image/')) {
    //   return NextResponse.json({ error: '仅支持图片文件' }, { status: 400 });
    // }

    // // 检查文件大小
    // if (file.size > 5 * 1024 * 1024) {
    //   return NextResponse.json({ error: '图片大小不能超过5MB' }, { status: 400 });
    // }

    // 读取文件内容
    const buffer = await file.arrayBuffer();

    // 生成文件名
    const fileName = `${Date.now()}-${file.name}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // 确保上传目录存在
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 写入文件
    const filePath = path.join(uploadsDir, fileName);
    await fs.promises.writeFile(filePath, Buffer.from(buffer));

    return NextResponse.json({ url: `/uploads/${fileName}` });

  } catch (error) {
    console.error('[MEDIA_UPLOAD]', error);
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    );
  }
}