// // app/api/admin/media/route.ts (本地开发)
// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get('file') as File;

//     if (!file) {
//       return NextResponse.json({ error: '未选择文件' }, { status: 400 });
//     }

//     // 读取文件内容
//     const buffer = await file.arrayBuffer();

//     // 生成文件名
//     const fileName = `${Date.now()}-${file.name}`;
//     const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

//     // 写入文件
//     await fs.promises.writeFile(filePath, Buffer.from(buffer));

//     return NextResponse.json({ url: `/uploads/${fileName}` });

//   } catch (error) {
//     console.log('[MEDIA_UPLOAD] Request received:', {
//       fileName: File.name,

//     });
//     return NextResponse.json(
//       { error: '文件上传失败' },
//       { status: 500 }
//     );
//   }
// }