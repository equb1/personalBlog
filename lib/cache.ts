// lib/cache.ts
import { createClient } from 'redis';
import * as cheerio from 'cheerio';
import { Heading } from '@/types';
import prisma from '@/lib/prisma';
const redis = createClient({ url: process.env.REDIS_URL });

redis.connect().catch((err) => {
  console.error('Redis 连接失败:', err);
});

export async function getCachedHeadings(slug: string): Promise<{ headings: Heading[]; contentHtml: string } | null> {
  try {
    // 获取文章的更新时间戳
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { updatedAt: true, contentHtml: true },
    });

    if (!post) return null;

    // 尝试获取缓存数据和缓存的更新时间戳
    const cachedData = await redis.get(`headings:${slug}`);
    const cachedUpdatedAt = await redis.get(`headings:${slug}:updatedAt`);

    // 如果缓存存在且缓存的更新时间戳与当前文章的更新时间戳一致，则返回缓存数据
    if (cachedData && cachedUpdatedAt === post.updatedAt.toISOString()) {
      return JSON.parse(cachedData);
    }

    // 如果缓存不存在或缓存的更新时间戳与当前文章的更新时间戳不一致，则重新生成缓存
    const $ = cheerio.load(post.contentHtml ?? '');
    const headings: Heading[] = [];
    $('h1, h2, h3').each((index, element) => {
      const $el = $(element);
      const id = $el.attr('id') || `heading-${index}`;
      $el.attr('id', id);
      headings.push({
        id,
        text: $el.text(),
        level: parseInt(element.tagName.substring(1)),
      });
    });

    const updatedContentHtml = $.html();
    const cacheData = { headings, contentHtml: updatedContentHtml };

    // 存储缓存数据和更新时间戳
    await redis.set(`headings:${slug}`, JSON.stringify(cacheData), { EX: 3600 });
    await redis.set(`headings:${slug}:updatedAt`, post.updatedAt.toISOString(), { EX: 3600 });

    return cacheData;
  } catch (error) {
    console.error('缓存目录失败:', error);
    return null;
  }
}