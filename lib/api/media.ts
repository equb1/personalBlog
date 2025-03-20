import { Media } from "@prisma/client";
import prisma from "../prisma";

export async function saveMedia(file: File, userId: string): Promise<Media> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/admin/media', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('上传失败');

  const { url } = await res.json(); // 获取上传后的文件 URL

  if (!url) {
    throw new Error('没有返回有效的 URL');
  }

  // 确保 url 是一个字符串
  console.log('返回的 URL:', url);

  // 插入到数据库
  const media = await prisma.media.create({
    data: {
      title: file.name,
      url: url,
      type: file.type,
      cover: '',  // 可以设置封面或者空字符串
      author: '', // 可以设置作者或者空字符串
      userId,     // 用户 ID
    },
  });

  return media;
}
