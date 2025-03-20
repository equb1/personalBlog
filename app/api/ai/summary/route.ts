// app/api/ai/summary/route.ts
import { NextResponse } from 'next/server';

const truncateToCompleteSentence = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;

  const lastPunctuationIndex = Math.max(
    text.lastIndexOf('。', maxLength),
    text.lastIndexOf('！', maxLength),
    text.lastIndexOf('？', maxLength),
    text.lastIndexOf('.', maxLength),
    text.lastIndexOf('!', maxLength),
    text.lastIndexOf('?', maxLength)
  );

  return lastPunctuationIndex > 0
    ? text.slice(0, lastPunctuationIndex + 1)
    : text.slice(0, maxLength) + '...';
};

export const dynamic = 'force-dynamic'; // 禁用静态缓存

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: '缺少内容参数' },
        { status: 400 }
      );
    }

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ARK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "ep-20250307164849-9z5pp",
        messages: [
          {
            role: "system",
            content: `你是一个SEO优化专家，请根据以下规则生成摘要：
                    1. 结构要求：
   - 首句点明核心主题
   - 中间说明技术方案
   - 结尾强调应用价值

2. 技术要求：
   - 包含3-5个技术关键词
   - 使用排比句式增强可读性
   - 避免使用"本文"、"我们"等主观表述

3. 格式规范：
   - 字数严格控制在135-150字
   - 使用中文全角标点
   - 示例："针对现代Web开发中的状态管理难题，本文对比分析了Redux与MobX的实现机制...最后提出渐进式迁移方案。"`
          },
          {
            role: "user",
            content: `请为以下内容生成SEO友好的摘要：\n\n${content.slice(0, 5000)}`
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
        stop: ["\n\n"]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || '摘要生成服务异常' },
        { status: 502 }
      );
    }

    const result = await response.json();
    const rawSummary = result.choices[0].message.content.trim();
    const summary = truncateToCompleteSentence(rawSummary, 150);
    console.log("zhaiyao", summary);
    return NextResponse.json({ summary });

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: '服务暂时不可用，请稍后重试' },
      { status: 500 }
    );
  }
}