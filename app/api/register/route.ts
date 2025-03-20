import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  // 设置 CORS 头
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  try {
    const { email, username, password } = await req.json();

    // 禁止注册特定用户名
    if (username === 'npcdyc') {
      return NextResponse.json({ error: '该用户名已被保留' }, { status: 400 });
    }

    // 检查邮箱和用户名是否已存在
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    const existingUsername = await prisma.user.findUnique({ where: { username } });

    if (existingEmail) {
      return NextResponse.json({ error: '邮箱已存在' }, { status: 400 });
    }
    if (existingUsername) {
      return NextResponse.json({ error: '用户名已存在' }, { status: 400 });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户并分配默认角色 "user"
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
        roles: {
          connectOrCreate: {
            where: { name: 'user' }, // 查找名为 "user" 的角色
            create: { name: 'user' }, // 如果不存在，则创建
          },
        },
      },
      include: { roles: true }, // 加载 roles 关系
    });

    return NextResponse.json({ message: '注册成功', user }, { status: 201 });
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json({ error: '注册失败，请稍后重试' }, { status: 500 });
  }
}