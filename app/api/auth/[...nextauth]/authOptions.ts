// authOptions.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('缺少用户名或密码');
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          include: { roles: true }, // 包含角色关联
        });

        if (!user || !user.passwordHash) {
          throw new Error('用户不存在');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('密码错误');
        }

        // 返回用户对象（包含角色名称数组）
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          image: user.image || `https://ui-avatars.com/api/?name=${user.username[0].toUpperCase()}&background=random&color=fff&size=128`, // 默认头像
          roles: user.roles.map(role => role.name), // 明确转换为字符串数组
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.image = user.image; // 确保 JWT 中包含用户头像
        token.roles = user.roles ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        username: token.username as string,
        image: token.image as string, // 确保会话中包含用户头像
        roles: (token.roles as string[]) || [],
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // 必须设置
  session: {
    strategy: 'jwt', // 明确使用 JWT 策略
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
};